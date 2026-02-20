import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  SpaceBetween,
  Box,
  Header,
  Link,
  Badge,
  ColumnLayout,
  StatusIndicator,
  Icon,
} from '@cloudscape-design/components';
import { curriculum } from '@/data/curriculum';
import '@/styles/dashboard.css';
import '@/styles/info-boxes.css';

// AWS 서비스명을 CSS 클래스명으로 변환
const getServiceBadgeClass = (service: string): string => {
  const serviceMap: { [key: string]: string } = {
    // Management & Governance
    'AWS Console': 'console',
    'AWS Management Console': 'console',
    'AWS CloudShell': 'cloudshell',
    'Amazon CloudWatch': 'cloudwatch',
    'AWS CloudFormation': 'cloudformation',
    'AWS Well-Architected Tool': 'well-architected-tool',

    // Storage
    'Amazon S3': 's3',
    'Amazon EBS': 'ebs',

    // Compute
    'Amazon EC2': 'ec2',
    'AWS Lambda': 'lambda',
    'Amazon ECS': 'ecs',
    'AWS Auto Scaling': 'auto-scaling',

    // Networking
    'Amazon VPC': 'vpc',
    'Elastic Load Balancing': 'elb',
    'Application Load Balancer': 'alb',
    'Amazon API Gateway': 'api-gateway',
    'Amazon CloudFront': 'cloudfront',
    'Amazon Route 53': 'route-53',

    // Database
    'Amazon RDS': 'rds',
    'Amazon Aurora': 'rds',
    'Amazon DynamoDB': 'dynamodb',
    'Amazon ElastiCache': 'elasticache',

    // Developer Tools
    'AWS CodePipeline': 'codepipeline',
    'AWS CodeBuild': 'codebuild',
    'AWS CodeCommit': 'codecommit',
    'AWS CodeDeploy': 'codedeploy',
    'AWS Infrastructure Composer': 'infrastructure-composer',

    // Security
    'AWS IAM': 'iam',
    'AWS STS': 'iam',
    'AWS Organizations': 'organizations',
    'Amazon Cognito': 'cognito',
    'Amazon GuardDuty': 'guardduty',
    'AWS Security Hub': 'security-hub',
    'AWS Secrets Manager': 'secrets-manager',
    'AWS KMS': 'kms',
    'AWS Certificate Manager': 'certificate-manager',

    // Management & Governance (추가 서비스)
    'AWS Systems Manager': 'systems-manager',
    'AWS Systems Manager Parameter Store': 'parameter-store',
    'Amazon SNS': 'sns',
    'AWS Config': 'config',
    'Amazon EventBridge': 'eventbridge',

    // Analytics
    'AWS Glue': 'glue',
    'Amazon Athena': 'athena',
    'AWS Lake Formation': 'lake-formation',
    'Amazon QuickSight': 'quicksight',
    'Amazon Quick Suite': 'quick-suite',

    // Cloud Financial Management
    'AWS Cost Explorer': 'cost-explorer',
    'AWS Budgets': 'budgets',

    // Machine Learning
    'Amazon SageMaker': 'sagemaker',
    'Amazon Rekognition': 'rekognition',
    'Amazon Bedrock': 'bedrock',

    // Analytics (추가)
    'OpenSearch Serverless': 'opensearch-serverless',
    'Amazon OpenSearch Serverless': 'opensearch-serverless',

    // Containers
    'Amazon ECR': 'ecr',
    'Amazon EKS': 'eks',
    Kubernetes: 'kubernetes',

    // Additional Services
    'AWS X-Ray': 'xray',
    'AWS Resource Groups & Tag Editor': 'resource-groups',
  };

  return serviceMap[service] || 'default';
};

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SpaceBetween direction="vertical" size="l">
      {/* 헤더 카드 */}
      <div className="dashboard-header-container">
        <Container
          header={
            <Header
              variant="h1"
              description="15주 커리큘럼으로 배우는 AWS 클라우드 서비스 디자인 및 구축"
            >
              한양대학교 클라우드 서비스 디자인
            </Header>
          }
        >
          <SpaceBetween direction="vertical" size="m">
            <Box
              color="text-body-secondary"
              className="dashboard-semester-info"
            >
              2026학년도 1학기 · 오주현 교수님
            </Box>

            {/* 실습 안내 - 보라색 info-box */}
            <div className="info-box info-box--note">
              <div className="info-box-icon">
                <Icon name="status-info" variant="normal" />
              </div>
              <div className="info-box-content">
                <strong>실습 안내</strong>
                <div>
                  각 주차를 클릭하여 실습 가이드를 확인하세요. 실습 파일은 각
                  가이드 페이지에서 다운로드할 수 있습니다.
                </div>
              </div>
            </div>
          </SpaceBetween>
        </Container>
      </div>

      {/* 교과목 개요 카드 */}
      <Container
        id="overview"
        header={
          <Header variant="h2">
            <span className="section-title">📚 교과목 개요</span>
          </Header>
        }
      >
        <Box padding={{ horizontal: 'l', vertical: 'm' }}>
          <SpaceBetween direction="vertical" size="l">
            <Box>
              <SpaceBetween direction="horizontal" size="m" alignItems="start">
                <Box fontSize="heading-l" color="text-label">
                  🎯
                </Box>
                <Box>
                  본 교육과정은{' '}
                  <strong>
                    클라우드의 고급 서비스와 엔터프라이즈급 아키텍처 설계 능력
                  </strong>
                  을 배양하는 고급 과정입니다.
                </Box>
              </SpaceBetween>
            </Box>

            <Box>
              <SpaceBetween direction="horizontal" size="m" alignItems="start">
                <Box fontSize="heading-l" color="text-label">
                  🚀
                </Box>
                <Box>
                  클라우드 아키텍처 설계부터 고급 보안 관리, 네트워크 구성,
                  서버리스 컴퓨팅, 데이터 파이프라인 구축까지 실무에서 요구되는
                  고도화된 기술을 학습합니다.
                </Box>
              </SpaceBetween>
            </Box>

            <Box>
              <SpaceBetween direction="horizontal" size="m" alignItems="start">
                <Box fontSize="heading-l" color="text-label">
                  💼
                </Box>
                <Box>
                  실제 기업의 복잡한 워크로드를 클라우드로 마이그레이션하고
                  운영할 수 있는 <strong>솔루션 아키텍트 수준의 역량</strong>을
                  개발합니다.
                </Box>
              </SpaceBetween>
            </Box>
          </SpaceBetween>
        </Box>
      </Container>

      {/* 주차별 커리큘럼 카드 */}
      <Container
        id="curriculum"
        header={
          <Header
            variant="h2"
            description="각 주차를 클릭하여 실습 가이드를 확인하세요"
          >
            <span className="section-title">📅 주차별 커리큘럼</span>
          </Header>
        }
      >
        <SpaceBetween direction="vertical" size="m">
          {curriculum.map((week) => (
            <Box
              key={week.week}
              id={`week-${week.week}`}
              padding="m"
              className="week-card"
            >
              <SpaceBetween direction="vertical" size="m">
                {/* 주차 헤더 */}
                <SpaceBetween
                  direction="horizontal"
                  size="s"
                  alignItems="center"
                >
                  <Badge color="grey">
                    Week {week.week.toString().padStart(2, '0')}
                  </Badge>
                  <Box variant="h3" fontSize="heading-m" fontWeight="bold">
                    {week.title}
                  </Box>
                </SpaceBetween>

                {/* 차시 목록 */}
                {week.sessions && week.sessions.length > 0 ? (
                  <ColumnLayout columns={3}>
                    {week.sessions.slice(0, 3).map((session, idx) => {
                      const hasLink =
                        session.hasContent &&
                        (session.type === 'lab' || session.type === 'demo');

                      // 타입별 StatusIndicator 타입
                      const getStatusType = ():
                        | 'success'
                        | 'info'
                        | 'stopped' => {
                        if (session.type === 'lab') return 'success'; // 실습: 초록색 체크
                        if (session.type === 'demo') return 'info'; // 데모: 파란색 정보
                        return 'stopped'; // 강의: 회색 정지
                      };

                      const getTypeLabel = () => {
                        if (session.type === 'lab') return '실습';
                        if (session.type === 'demo') return '데모';
                        return '강의';
                      };

                      return (
                        <Box key={idx} className="session-item">
                          <SpaceBetween direction="vertical" size="xs">
                            <SpaceBetween
                              direction="horizontal"
                              size="xs"
                              alignItems="center"
                            >
                              <StatusIndicator type={getStatusType()}>
                                {getTypeLabel()}
                              </StatusIndicator>
                              <Box fontWeight="bold" color="text-label">
                                {week.week}-{session.session}
                              </Box>
                            </SpaceBetween>
                            {hasLink ? (
                              <Link
                                fontSize="inherit"
                                onFollow={() =>
                                  navigate(
                                    `/week/${week.week}/session/${session.session}`,
                                  )
                                }
                              >
                                {session.title}
                              </Link>
                            ) : (
                              <Box color="text-body-secondary">
                                {session.title}
                              </Box>
                            )}
                          </SpaceBetween>
                        </Box>
                      );
                    })}
                  </ColumnLayout>
                ) : (
                  <Box
                    color="text-body-secondary"
                    textAlign="center"
                    padding="m"
                  >
                    실습 없음
                  </Box>
                )}

                {/* AWS 서비스 배지 */}
                {week.sessions &&
                  week.sessions.length > 0 &&
                  (() => {
                    const allServices = week.sessions.flatMap(
                      (session) => session.awsServices || [],
                    );
                    const uniqueServices = [...new Set(allServices)];

                    return (
                      uniqueServices.length > 0 && (
                        <Box>
                          <SpaceBetween direction="vertical" size="xs">
                            <Box
                              color="text-label"
                              className="aws-services-label"
                            >
                              관련 AWS 서비스:
                            </Box>
                            <SpaceBetween direction="horizontal" size="xs">
                              {uniqueServices.map((service, idx) => (
                                <span
                                  key={idx}
                                  className={`aws-service-badge ${getServiceBadgeClass(service)}`}
                                >
                                  {service}
                                </span>
                              ))}
                            </SpaceBetween>
                          </SpaceBetween>
                        </Box>
                      )
                    );
                  })()}
              </SpaceBetween>
            </Box>
          ))}
        </SpaceBetween>
      </Container>
    </SpaceBetween>
  );
};
