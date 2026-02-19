import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Footer } from '@/components/layout';
import '@/styles/home.css';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <main className="home-main">
        <div className="home-hero">
          <div className="home-hero-content">
            <div className="home-badge">Cloud Service Design</div>
            <div className="home-semester">
              2026학년도 1학기 · 오주현 교수님
            </div>

            <h1 className="home-title">
              한양대학교
              <br />
              <span className="home-title-highlight">
                클라우드 서비스 디자인
              </span>
            </h1>

            <p className="home-subtitle">
              15주 커리큘럼으로 배우는
              <br />
              AWS 클라우드 서비스 디자인 및 구축
            </p>

            <button
              className="home-cta-button"
              onClick={() => navigate('/dashboard')}
            >
              <span>실습 시작하기</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M7.5 15L12.5 10L7.5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <div className="home-features">
              <div className="home-feature">
                <div className="home-feature-icon">🏗️</div>
                <div className="home-feature-text">아키텍처 설계</div>
              </div>
              <div className="home-feature">
                <div className="home-feature-icon">🔬</div>
                <div className="home-feature-text">실전 프로젝트</div>
              </div>
              <div className="home-feature">
                <div className="home-feature-icon">🚀</div>
                <div className="home-feature-text">클라우드 전문가</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer variant="light" />
    </div>
  );
};
