import React, { useState } from 'react'
import {
    Container,
    Header,
    SpaceBetween,
    Box,
    ColumnLayout,
    Icon,
    Tabs
} from '@cloudscape-design/components'
import '@/styles/environment-setup.css'
import '@/styles/info-boxes.css'

export const EnvironmentSetup: React.FC = () => {
    const [activeTabId, setActiveTabId] = useState('overview')

    return (
        <SpaceBetween direction="vertical" size="l">
            {/* 헤더 카드 */}
            <Container
                header={
                    <Header
                        variant="h1"
                        description="AWS 실습을 시작하기 전에 필요한 환경 설정 및 확인 가이드"
                    >
                        환경 설정
                    </Header>
                }
            >
                <SpaceBetween direction="vertical" size="m">
                    <Box fontSize="body-m">
                        실습을 시작하기 전에 <strong>AWS 계정 접속 및 기본 환경</strong>을 확인해야 합니다.
                        이 가이드는 제공된 AWS 계정으로 로그인하고, 실습에 필요한 리전 및 권한을 확인하는 방법을 안내합니다.
                    </Box>

                    {/* 중요 안내 - 보라색 info-box */}
                    <div className="info-box info-box--note">
                        <div className="info-box-icon">
                            <Icon name="status-warning" variant="warning" />
                        </div>
                        <div className="info-box-content">
                            <strong>중요</strong>
                            <div>실습 환경은 교육 목적으로만 사용해야 하며, 개인 정보나 민감한 데이터를 입력하지 마세요. 실습 종료 후 생성한 모든 리소스를 반드시 삭제해야 합니다.</div>
                        </div>
                    </div>
                </SpaceBetween>
            </Container>

            {/* 탭 컨테이너 */}
            <Container>
                <Tabs
                    activeTabId={activeTabId}
                    onChange={({ detail }) => setActiveTabId(detail.activeTabId)}
                    tabs={[
                        {
                            id: 'overview',
                            label: '📋 개요',
                            content: (
                                <SpaceBetween direction="vertical" size="l">
                                    <ColumnLayout columns={3}>
                                        <Box>
                                            <SpaceBetween direction="vertical" size="m">
                                                <Box textAlign="center">
                                                    <Icon name="user-profile" size="large" />
                                                </Box>
                                                <Box variant="h3" textAlign="center">1. AWS 계정 접속</Box>
                                                <Box fontSize="body-m" textAlign="center">
                                                    교육용 AWS 계정으로 로그인합니다
                                                </Box>
                                            </SpaceBetween>
                                        </Box>

                                        <Box>
                                            <SpaceBetween direction="vertical" size="m">
                                                <Box textAlign="center">
                                                    <Icon name="settings" size="large" />
                                                </Box>
                                                <Box variant="h3" textAlign="center">2. 리전 설정</Box>
                                                <Box fontSize="body-m" textAlign="center">
                                                    서울 리전(ap-northeast-2)을 선택합니다
                                                </Box>
                                            </SpaceBetween>
                                        </Box>

                                        <Box>
                                            <SpaceBetween direction="vertical" size="m">
                                                <Box textAlign="center">
                                                    <Icon name="status-positive" size="large" />
                                                </Box>
                                                <Box variant="h3" textAlign="center">3. 권한 확인</Box>
                                                <Box fontSize="body-m" textAlign="center">
                                                    필요한 권한이 있는지 확인합니다
                                                </Box>
                                            </SpaceBetween>
                                        </Box>
                                    </ColumnLayout>
                                </SpaceBetween>
                            )
                        },
                        {
                            id: 'account',
                            label: '🔐 AWS 계정',
                            content: (
                                <SpaceBetween direction="vertical" size="m">
                                    <Box fontSize="body-m">
                                        교육용 AWS 계정 정보는 교수님 또는 조교로부터 제공받습니다.
                                    </Box>

                                    <ColumnLayout columns={2}>
                                        <Box>
                                            <SpaceBetween direction="vertical" size="s">
                                                <Box>
                                                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                                        <Icon name="user-profile" variant="link" />
                                                        <Box variant="h4">계정 정보</Box>
                                                    </SpaceBetween>
                                                </Box>
                                                <Box className="tab-content-text">
                                                    <SpaceBetween direction="vertical" size="xxs">
                                                        <Box className="tab-content-text">• 계정 ID (12자리 숫자)</Box>
                                                        <Box className="tab-content-text">• IAM 사용자 이름</Box>
                                                        <Box className="tab-content-text">• 임시 비밀번호</Box>
                                                    </SpaceBetween>
                                                </Box>
                                            </SpaceBetween>
                                        </Box>

                                        <Box>
                                            <SpaceBetween direction="vertical" size="s">
                                                <Box>
                                                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                                        <Icon name="status-info" variant="link" />
                                                        <Box variant="h4">접속 방법</Box>
                                                    </SpaceBetween>
                                                </Box>
                                                <Box className="tab-content-text">
                                                    <SpaceBetween direction="vertical" size="xxs">
                                                        <Box className="tab-content-text">1. AWS Console 로그인 페이지 접속</Box>
                                                        <Box className="tab-content-text">2. 계정 ID 입력</Box>
                                                        <Box className="tab-content-text">3. IAM 사용자로 로그인</Box>
                                                    </SpaceBetween>
                                                </Box>
                                            </SpaceBetween>
                                        </Box>
                                    </ColumnLayout>
                                </SpaceBetween>
                            )
                        },
                        {
                            id: 'region',
                            label: '🌏 리전 설정',
                            content: (
                                <SpaceBetween direction="vertical" size="m">
                                    <Box fontSize="body-m">
                                        모든 실습은 <strong>서울 리전 (ap-northeast-2)</strong>에서 진행됩니다.
                                    </Box>

                                    {/* 리전 확인 - 보라색 info-box */}
                                    <div className="info-box info-box--note">
                                        <div className="info-box-icon">
                                            <Icon name="status-info" variant="link" />
                                        </div>
                                        <div className="info-box-content">
                                            <strong>리전 확인</strong>
                                            <div>AWS Console 우측 상단의 리전 선택 드롭다운에서 "아시아 태평양(서울) ap-northeast-2"가 선택되어 있는지 확인합니다.</div>
                                        </div>
                                    </div>

                                    <Box>
                                        <SpaceBetween direction="vertical" size="s">
                                            <Box>
                                                <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                                    <Icon name="status-warning" variant="warning" />
                                                    <Box variant="h4">주의사항</Box>
                                                </SpaceBetween>
                                            </Box>
                                            <Box className="tab-content-text">
                                                <SpaceBetween direction="vertical" size="xxs">
                                                    <Box className="tab-content-text">• 리전이 다르면 실습 파일이나 리소스를 찾을 수 없습니다</Box>
                                                    <Box className="tab-content-text">• 실습 중 리전을 변경하지 않습니다</Box>
                                                    <Box className="tab-content-text">• 모든 리소스는 서울 리전에 생성합니다</Box>
                                                </SpaceBetween>
                                            </Box>
                                        </SpaceBetween>
                                    </Box>
                                </SpaceBetween>
                            )
                        },
                        {
                            id: 'permissions',
                            label: '🔑 권한 확인',
                            content: (
                                <SpaceBetween direction="vertical" size="m">
                                    <Box fontSize="body-m">
                                        교육용 계정에는 실습에 필요한 권한이 미리 설정되어 있습니다.
                                    </Box>

                                    <ColumnLayout columns={3}>
                                        <Box>
                                            <SpaceBetween direction="vertical" size="s">
                                                <Box>
                                                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                                        <Icon name="check" variant="success" />
                                                        <Box variant="h4">허용된 작업</Box>
                                                    </SpaceBetween>
                                                </Box>
                                                <Box className="tab-content-text">
                                                    <SpaceBetween direction="vertical" size="xxs">
                                                        <Box className="tab-content-text">• 리소스 생성</Box>
                                                        <Box className="tab-content-text">• 리소스 수정</Box>
                                                        <Box className="tab-content-text">• 리소스 삭제</Box>
                                                        <Box className="tab-content-text">• 콘솔 접근</Box>
                                                    </SpaceBetween>
                                                </Box>
                                            </SpaceBetween>
                                        </Box>

                                        <Box>
                                            <SpaceBetween direction="vertical" size="s">
                                                <Box>
                                                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                                        <Icon name="status-warning" variant="warning" />
                                                        <Box variant="h4">제한된 작업</Box>
                                                    </SpaceBetween>
                                                </Box>
                                                <Box className="tab-content-text">
                                                    <SpaceBetween direction="vertical" size="xxs">
                                                        <Box className="tab-content-text">• 결제 정보 접근</Box>
                                                        <Box className="tab-content-text">• 계정 설정 변경</Box>
                                                        <Box className="tab-content-text">• IAM 사용자 생성</Box>
                                                        <Box className="tab-content-text">• 루트 계정 작업</Box>
                                                    </SpaceBetween>
                                                </Box>
                                            </SpaceBetween>
                                        </Box>

                                        <Box>
                                            <SpaceBetween direction="vertical" size="s">
                                                <Box>
                                                    <SpaceBetween direction="horizontal" size="xs" alignItems="center">
                                                        <Icon name="status-info" variant="link" />
                                                        <Box variant="h4">권한 오류 시</Box>
                                                    </SpaceBetween>
                                                </Box>
                                                <Box className="tab-content-text">
                                                    <Box className="tab-content-text">권한 오류가 발생하면 교수님 또는 조교에게 문의합니다.</Box>
                                                </Box>
                                            </SpaceBetween>
                                        </Box>
                                    </ColumnLayout>
                                </SpaceBetween>
                            )
                        },
                        {
                            id: 'complete',
                            label: '✅ 준비 완료',
                            content: (
                                <SpaceBetween direction="vertical" size="m">
                                    {/* 준비 완료 - 보라색 info-box */}
                                    <div className="info-box info-box--success">
                                        <div className="info-box-icon">
                                            <Icon name="status-positive" variant="success" />
                                        </div>
                                        <div className="info-box-content">
                                            <strong>준비 완료</strong>
                                            <div>AWS 계정 접속, 리전 설정, 권한 확인이 모두 완료되었습니다. 이제 주차별 실습을 시작할 수 있습니다.</div>
                                        </div>
                                    </div>

                                    <Box>
                                        <SpaceBetween direction="vertical" size="s">
                                            <Box variant="h3">다음 단계</Box>
                                            <Box className="tab-content-text">
                                                <SpaceBetween direction="vertical" size="xs">
                                                    <Box className="tab-content-text">1. 좌측 메뉴에서 "📚 커리큘럼"을 클릭합니다</Box>
                                                    <Box className="tab-content-text">2. 원하는 주차를 선택합니다</Box>
                                                    <Box className="tab-content-text">3. 실습 가이드를 따라 진행합니다</Box>
                                                </SpaceBetween>
                                            </Box>
                                        </SpaceBetween>
                                    </Box>
                                </SpaceBetween>
                            )
                        }
                    ]}
                />
            </Container>
        </SpaceBetween>
    )
}
