import React, { ReactNode, useState, useEffect } from 'react';
import {
  AppLayout as CloudScapeAppLayout,
  SideNavigation,
  BreadcrumbGroup,
  HelpPanel,
  TopNavigation,
  Box,
} from '@cloudscape-design/components';
import { useTheme } from '@/contexts/ThemeContext';
import { curriculum, sessionTypeConfig } from '@/data/curriculum';
import { HelpPanelContent } from '../education';
import '@/styles/app-layout.css';

interface AppLayoutProps {
  children: ReactNode;
  currentPath: string;
  onNavigate: (href: string) => void;
}

// 반응형 브레이크포인트 (CloudScape 기본값)
const MOBILE_BREAKPOINT = 688;

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentPath,
  onNavigate,
}) => {
  const { theme, setTheme } = useTheme();
  const [toolsOpen, setToolsOpen] = useState(false);

  // 초기 상태를 현재 창 크기에 따라 설정
  const [navigationOpen, setNavigationOpen] = useState(() => {
    return window.innerWidth >= MOBILE_BREAKPOINT;
  });

  // 창 크기 변경 감지
  useEffect(() => {
    const handleResize = () => {
      const shouldBeOpen = window.innerWidth >= MOBILE_BREAKPOINT;
      setNavigationOpen(shouldBeOpen);
    };

    // 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);

    // 초기 실행
    handleResize();

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navigationItems = [
    {
      type: 'section' as const,
      text: '시작하기',
      items: [
        { type: 'link' as const, text: '📚 커리큘럼', href: '/dashboard' },
        { type: 'link' as const, text: '⚙️ 환경 설정', href: '/setup' },
      ],
    },
    { type: 'divider' as const },
    // 주차별 섹션 메뉴 생성 (실습/데모/시험만 표시)
    ...curriculum
      .map((week) => {
        // 실습/데모/시험 차시만 필터링 (theory 제외)
        const visibleSessions = week.sessions.filter(
          (session) => session.type !== 'theory',
        );

        // 표시할 차시가 없으면 이 주차는 메뉴에서 제외
        if (visibleSessions.length === 0) {
          return null;
        }

        return {
          type: 'section' as const,
          text: `${week.week}주차: ${week.title}`,
          items: visibleSessions.map((session) => {
            // sessionTypeConfig에서 이모지 가져오기
            const config = sessionTypeConfig[session.type];
            const icon = config.emoji;

            return {
              type: 'link' as const,
              text: `${icon} ${week.week}-${session.session}. ${session.title}`,
              href: `/week/${week.week}/session/${session.session}`,
            };
          }),
        };
      })
      .filter((item) => item !== null), // null 항목 제거
  ];

  // 브레드크럼 생성
  const getBreadcrumbs = () => {
    const breadcrumbs = [{ text: '홈', href: '/' }];

    if (currentPath === '/dashboard') {
      breadcrumbs.push({ text: '시작하기', href: '#' });
      breadcrumbs.push({ text: '📚 커리큘럼', href: '/dashboard' });
    } else if (currentPath === '/setup') {
      breadcrumbs.push({ text: '시작하기', href: '#' });
      breadcrumbs.push({ text: '⚙️ 환경 설정', href: '/setup' });
    } else if (currentPath.startsWith('/week/')) {
      const pathParts = currentPath.split('/');
      const weekNumber = parseInt(pathParts[2]);
      const weekData = curriculum.find((w) => w.week === weekNumber);

      if (weekData) {
        breadcrumbs.push({
          text: `${weekNumber}주차`,
          href: `/week/${weekNumber}`,
        });

        // 차시 정보가 있으면 추가
        if (pathParts.length > 4 && pathParts[3] === 'session') {
          const sessionNumber = parseInt(pathParts[4]);
          const sessionData = weekData.sessions.find(
            (s) => s.session === sessionNumber,
          );
          if (sessionData) {
            const config = sessionTypeConfig[sessionData.type];
            breadcrumbs.push({
              text: `${config.emoji} ${weekNumber}-${sessionNumber}. ${sessionData.title}`,
              href: currentPath,
            });
          }
        }
      }
    }

    return breadcrumbs;
  };

  // 도움말 패널 내용
  const helpPanel = (
    <HelpPanel header={<Box variant="h3">AWS 용어 사전</Box>} footer={null}>
      <HelpPanelContent />
    </HelpPanel>
  );

  return (
    <div className={`awsui-${theme}-mode app-layout-container`}>
      {/* TopNavigation을 고정 위치에 배치 */}
      <div className="app-layout-top-nav">
        <TopNavigation
          identity={{
            href: import.meta.env.BASE_URL || '/',
            title: '한양대학교 클라우드 서비스 디자인',
          }}
          utilities={[
            {
              type: 'button',
              iconName: 'status-info',
              text: '용어 사전',
              onClick: () => setToolsOpen(!toolsOpen),
              ariaLabel: '용어 사전 열기',
            },
            {
              type: 'button',
              text: theme === 'dark' ? '☀️ 라이트 모드' : '🌙 다크 모드',
              onClick: toggleTheme,
            },
          ]}
        />
      </div>

      <CloudScapeAppLayout
        navigationWidth={400}
        toolsWidth={400}
        stickyNotifications
        breadcrumbs={
          <BreadcrumbGroup
            items={getBreadcrumbs()}
            onFollow={(event) => {
              if (!event.detail.external) {
                event.preventDefault();
                onNavigate(event.detail.href);
              }
            }}
          />
        }
        navigation={
          <SideNavigation
            activeHref={currentPath}
            header={{ text: '실습 가이드', href: '/' }}
            items={navigationItems}
            onFollow={(event) => {
              if (!event.detail.external) {
                event.preventDefault();
                onNavigate(event.detail.href);
              }
            }}
          />
        }
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        tools={helpPanel}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        content={children}
        contentType="default"
      />
    </div>
  );
};
