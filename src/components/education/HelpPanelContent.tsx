import React, { useState, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ExpandableSection, SpaceBetween, Box, Badge, Input, Link } from '@cloudscape-design/components'
import { labTerms, type Term } from '@/data/helpTerms'
import { curriculum } from '@/data/curriculum'
import { loadMarkdownFile } from '@/utils/markdownLoader'
import './HelpPanelContent.css'

interface HelpPanelContentProps {
    // 현재 props 없음 - 향후 확장 가능
}

// 목차 아이템 인터페이스
interface TocItem {
    id: string
    title: string
    level: number
    emoji?: string
}

// 검색어 하이라이팅 함수
const highlightText = (text: string, searchTerm: string): React.ReactNode => {
    if (!searchTerm.trim()) return text

    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
        regex.test(part) ? (
            <mark key={index} className="search-highlight">{part}</mark>
        ) : (
            part
        )
    )
}

// AWS 카테고리별 색상 매핑 (현재 미사용 - 추후 활용 예정)
// const categoryColorMap: Record<string, string> = {
//     'Management': 'red',
//     'Storage': 'green',
//     'Compute': 'grey',
//     'Networking': 'blue',
//     'Database': 'red',
//     'Security': 'red',
//     'AI/ML': 'green',
//     'Containers': 'grey',
//     'Developer Tools': 'red',
//     'Analytics': 'blue',
//     'Cost Management': 'green'
// }

// 카테고리별 아이콘
const categoryIcons: Record<string, string> = {
    'AWS 서비스': '☁️',
    '네트워킹': '🌐',
    '보안': '🔒',
    '데이터베이스': '💾',
    '컨테이너': '📦',
    'Kubernetes': '☸️',
    '서버리스': '⚡',
    '머신러닝': '🤖',
    '일반': '📌'
}

export const HelpPanelContent: React.FC<HelpPanelContentProps> = () => {
    const location = useLocation()
    const [searchTerm, setSearchTerm] = useState('')
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
    const [termClickCounts, setTermClickCounts] = useState<Record<string, number>>({})
    const [tableOfContents, setTableOfContents] = useState<TocItem[]>([])
    const [termsExpanded, setTermsExpanded] = useState(true)

    // 마크다운에서 목차 추출
    useEffect(() => {
        const extractToc = async () => {
            // SessionGuide 페이지인지 확인
            const pathMatch = location.pathname.match(/^\/week\/(\d+)\/session\/(\d+)$/)
            if (!pathMatch) {
                setTableOfContents([])
                return
            }

            const weekNumber = parseInt(pathMatch[1])
            const sessionNumber = parseInt(pathMatch[2])

            // 커리큘럼에서 세션 데이터 찾기
            const weekData = curriculum.find(w => w.week === weekNumber)
            const sessionData = weekData?.sessions.find(s => s.session === sessionNumber)

            if (!sessionData?.hasContent || !sessionData.markdownPath) {
                setTableOfContents([])
                return
            }

            try {
                const data = await loadMarkdownFile(sessionData.markdownPath)
                const content = data.content

                const toc: TocItem[] = []

                // 리소스 정리와 참고 섹션 분리
                const cleanupMatch = content.match(/\n(?:##? 🗑️ )?리소스 정리[\s\S]*$/)
                const referenceMatch = content.match(/\n## (?:📚 )?참고:[\s\S]*$/)

                let mainContent = content
                let cleanupContent = ''
                let referenceContent = ''

                if (cleanupMatch) {
                    cleanupContent = cleanupMatch[0]
                    mainContent = content.substring(0, cleanupMatch.index)
                }

                if (referenceMatch && referenceMatch.index! < (cleanupMatch?.index || Infinity)) {
                    referenceContent = referenceMatch[0]
                    mainContent = content.substring(0, referenceMatch.index)
                }

                // 1. 메인 콘텐츠에서 태스크 추출
                const taskRegex = /^##\s+태스크\s+(\d+):\s+(.+)$/gm
                let match
                while ((match = taskRegex.exec(mainContent)) !== null) {
                    const taskNumber = match[1]
                    const taskTitle = match[2].trim()
                    toc.push({
                        id: `task-${taskNumber}`,
                        title: `태스크 ${taskNumber}: ${taskTitle}`,
                        level: 2,
                        emoji: '📝'
                    })
                }

                // 2. 리소스 정리 섹션
                if (cleanupContent) {
                    toc.push({
                        id: 'cleanup',
                        title: '리소스 정리',
                        level: 1,
                        emoji: '🗑️'
                    })
                }

                // 3. 참고 섹션
                if (referenceContent) {
                    const refMatch = referenceContent.match(/^##\s+(?:📚 )?참고:\s*(.+)$/m)
                    if (refMatch) {
                        const refTitle = refMatch[1].trim()
                        toc.push({
                            id: 'reference',
                            title: `참고: ${refTitle}`,
                            level: 1,
                            emoji: '📚'
                        })
                    }
                }

                setTableOfContents(toc)
            } catch (error) {
                console.error('목차 추출 실패:', error)
                setTableOfContents([])
            }
        }

        extractToc()
    }, [location.pathname])

    // 로컬 스토리지에서 데이터 불러오기
    useEffect(() => {
        const savedCounts = localStorage.getItem('termClickCounts')

        if (savedCounts) {
            setTermClickCounts(JSON.parse(savedCounts))
        }
    }, [])

    // 용어 클릭 시 클릭 횟수 증가
    const handleTermClick = (termName: string) => {
        // 클릭 횟수 증가
        const updatedCounts = {
            ...termClickCounts,
            [termName]: (termClickCounts[termName] || 0) + 1
        }
        setTermClickCounts(updatedCounts)
        localStorage.setItem('termClickCounts', JSON.stringify(updatedCounts))
    }

    // 클릭 횟수 기반으로 자주 찾는 용어 계산 (항상 상위 5개만 표시)
    const popularTerms = useMemo(() => {
        const defaultTerms = ['Amazon S3', 'AWS Lambda', 'Amazon VPC', 'IAM Role', 'Security Group']
        const clickedTerms = Object.entries(termClickCounts)

        // 클릭한 용어가 없으면 기본 추천 용어 표시
        if (clickedTerms.length === 0) {
            return defaultTerms
        }

        // 클릭 횟수가 많은 순서대로 정렬
        const sortedTerms = clickedTerms
            .sort(([, a], [, b]) => b - a)
            .map(([term]) => term)

        // 상위 5개만 표시 (클릭한 용어가 5개 미만이면 기본 추천 용어로 채우기)
        if (sortedTerms.length >= 5) {
            return sortedTerms.slice(0, 5)
        }

        // 클릭한 용어 + 기본 추천 용어 (중복 제거)
        const combined = [...sortedTerms]
        for (const term of defaultTerms) {
            if (!combined.includes(term) && combined.length < 5) {
                combined.push(term)
            }
        }

        return combined.slice(0, 5)
    }, [termClickCounts])

    // 빠른 점프 클릭 핸들러
    const handleQuickJump = (termName: string) => {
        setSearchTerm(termName)
        handleTermClick(termName)
    }

    // 자주 찾는 용어 초기화 (클릭 횟수 리셋)
    const resetPopularTerms = () => {
        setTermClickCounts({})
        localStorage.removeItem('termClickCounts')
    }

    // 카테고리별로 용어 그룹화
    const termsByCategory = useMemo(() => {
        const grouped: Record<string, Term[]> = {}

        labTerms.forEach(term => {
            if (!grouped[term.category]) {
                grouped[term.category] = []
            }
            grouped[term.category].push(term)
        })

        // 각 카테고리 내에서 알파벳 순으로 정렬
        Object.keys(grouped).forEach(category => {
            grouped[category].sort((a, b) => a.term.localeCompare(b.term))
        })

        return grouped
    }, [])

    // 검색어로 필터링
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) {
            return termsByCategory
        }

        const filtered: Record<string, Term[]> = {}
        const lowerSearch = searchTerm.toLowerCase()

        Object.entries(termsByCategory).forEach(([category, terms]) => {
            const matchedTerms = terms.filter(term =>
                term.term.toLowerCase().includes(lowerSearch) ||
                term.definition.toLowerCase().includes(lowerSearch)
            )

            if (matchedTerms.length > 0) {
                filtered[category] = matchedTerms
            }
        })

        return filtered
    }, [termsByCategory, searchTerm])

    // 카테고리 토글
    const toggleCategory = (category: string) => {
        const newExpanded = new Set(expandedCategories)
        if (newExpanded.has(category)) {
            newExpanded.delete(category)
        } else {
            newExpanded.add(category)
        }
        setExpandedCategories(newExpanded)
    }

    // 목차 항목 클릭 핸들러
    const handleTocClick = (id: string) => {
        // 해당 섹션으로 스크롤
        const element = document.getElementById(id)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    return (
        <div className="help-panel-wrapper">
            <SpaceBetween direction="vertical" size="m">
                {/* 페이지 목차 (SessionGuide 페이지에서만 표시) */}
                {tableOfContents.length > 0 && (
                    <div className="toc-section">
                        <Box variant="h3" padding={{ bottom: 's' }}>
                            📖 페이지 목차
                        </Box>
                        <div className="toc-items">
                            {tableOfContents.map((item) => (
                                <Link
                                    key={item.id}
                                    variant="secondary"
                                    onFollow={(e) => {
                                        e.preventDefault()
                                        handleTocClick(item.id)
                                    }}
                                    fontSize={item.level === 1 ? 'body-m' : 'body-s'}
                                >
                                    <Box
                                        padding={{ left: item.level === 2 ? 'm' : undefined }}
                                        color={item.level === 1 ? 'inherit' : 'text-body-secondary'}
                                    >
                                        {item.emoji && `${item.emoji} `}{item.title}
                                    </Box>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* 용어 사전 (ExpandableSection으로 감싸기) */}
                <ExpandableSection
                    headerText={
                        <Box variant="h3">
                            📚 용어 사전
                        </Box>
                    }
                    expanded={termsExpanded}
                    onChange={({ detail }) => setTermsExpanded(detail.expanded)}
                >
                    <SpaceBetween direction="vertical" size="m">
                        {/* 검색 입력 */}
                        <Input
                            value={searchTerm}
                            onChange={({ detail }) => setSearchTerm(detail.value)}
                            placeholder="용어 검색..."
                            type="search"
                            clearAriaLabel="검색어 지우기"
                        />

                        {/* 자주 찾는 용어 */}
                        {popularTerms.length > 0 && (
                            <div className="quick-jump-section">
                                <div className="quick-jump-header">
                                    <div className="quick-jump-title">
                                        ⭐ 자주 찾는 용어
                                    </div>
                                    {Object.keys(termClickCounts).length > 0 && (
                                        <button
                                            className="quick-jump-clear-btn"
                                            onClick={resetPopularTerms}
                                            aria-label="자주 찾는 용어 초기화"
                                        >
                                            초기화
                                        </button>
                                    )}
                                </div>
                                <div className="quick-jump-chips">
                                    {popularTerms.map((termName) => (
                                        <div
                                            key={termName}
                                            className="quick-jump-chip"
                                            onClick={() => handleQuickJump(termName)}
                                        >
                                            <span className="quick-jump-chip-text">
                                                {termName}
                                            </span>
                                            {termClickCounts[termName] && (
                                                <Badge color="blue">{termClickCounts[termName]}</Badge>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 용어 목록 (아코디언) */}
                        <div className="help-accordion-container">
                            <SpaceBetween direction="vertical" size="s">
                                {Object.entries(filteredCategories).map(([category, terms]) => (
                                    <ExpandableSection
                                        key={category}
                                        headerText={
                                            <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                                <span>{categoryIcons[category] || '📌'}</span>
                                                <span>{category}</span>
                                                <Badge color="grey">{terms.length}</Badge>
                                            </SpaceBetween>
                                        }
                                        expanded={expandedCategories.has(category)}
                                        onChange={() => toggleCategory(category)}
                                    >
                                        <SpaceBetween direction="vertical" size="s">
                                            {terms.map((term) => {
                                                const categoryClass = term.awsCategory
                                                    ? `category-${term.awsCategory.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')}`
                                                    : 'category-default'

                                                return (
                                                    <div
                                                        key={term.term}
                                                        className="help-term-card"
                                                        onClick={() => handleTermClick(term.term)}
                                                    >
                                                        {/* 1번째 행: 용어명 + AWS 카테고리 배지 */}
                                                        <div className={`help-term-header ${categoryClass}`}>
                                                            <span className="help-term-name">
                                                                {highlightText(term.term, searchTerm)}
                                                            </span>
                                                            {term.awsCategory && (
                                                                <span className="help-term-category-badge">
                                                                    {term.awsCategory}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* 2번째 행: 설명 */}
                                                        <div className="help-term-body">
                                                            <div className="help-term-definition">
                                                                {term.definition.split('\n').map((line, idx) => {
                                                                    // 첫 번째 줄(주요 설명)만 굵게 표시
                                                                    if (idx === 0) {
                                                                        return (
                                                                            <React.Fragment key={idx}>
                                                                                <strong className="help-term-definition-first-line">
                                                                                    {highlightText(line, searchTerm)}
                                                                                </strong>
                                                                                {term.definition.split('\n').length > 1 && <br />}
                                                                            </React.Fragment>
                                                                        )
                                                                    }
                                                                    return (
                                                                        <React.Fragment key={idx}>
                                                                            {highlightText(line, searchTerm)}
                                                                            {idx < term.definition.split('\n').length - 1 && <br />}
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                            </div>

                                                            {/* 주차 정보 표시 */}
                                                            {term.weeks && term.weeks.length > 0 && (
                                                                <Box margin={{ top: 's' }}>
                                                                    <SpaceBetween direction="horizontal" size="xs">
                                                                        {term.weeks.map((week, idx) => (
                                                                            <Badge key={idx} color="blue">
                                                                                {week}
                                                                            </Badge>
                                                                        ))}
                                                                    </SpaceBetween>
                                                                </Box>
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </SpaceBetween>
                                    </ExpandableSection>
                                ))}
                            </SpaceBetween>
                        </div>

                        {/* 검색 결과 없음 */}
                        {Object.keys(filteredCategories).length === 0 && searchTerm && (
                            <Box textAlign="center" padding="l" color="text-body-secondary">
                                <SpaceBetween direction="vertical" size="s">
                                    <Box fontSize="heading-m">🔍</Box>
                                    <Box>"{searchTerm}"에 대한 검색 결과가 없습니다.</Box>
                                    <Box fontSize="body-s">다른 검색어를 시도해보세요.</Box>
                                </SpaceBetween>
                            </Box>
                        )}
                    </SpaceBetween>
                </ExpandableSection>
            </SpaceBetween>
        </div>
    )
}
