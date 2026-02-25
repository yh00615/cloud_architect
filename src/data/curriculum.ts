// 실습 계획서 기반 커리큘럼 데이터

export type SessionType = 'theory' | 'lab' | 'demo' | 'none';

export interface Session {
  session: number; // 차시 번호 (1, 2, 3)
  type: SessionType;
  title: string;
  hasContent: boolean; // 실습/데모 가이드가 있는지
  markdownPath?: string; // 마크다운 파일 경로
  description?: string; // 차시 설명
  awsServices?: string[]; // 사용하는 AWS 서비스
}

export interface WeekCurriculum {
  week: number;
  title: string;
  description: string; // 주차 설명
  sessions: Session[];
  learningObjectives?: string[]; // 학습 목표
  prerequisites?: string[]; // 사전 요구사항
  estimatedTime?: string; // 예상 소요 시간
  difficulty?: 'beginner' | 'intermediate' | 'advanced'; // 난이도
}

// 15주차 커리큘럼 데이터 (실제 실습 계획서 기반)
export const curriculum: WeekCurriculum[] = [
  {
    week: 1,
    title: '클라우드 서비스 디자인 개요',
    description:
      'AWS 글로벌 인프라의 구성 요소와 아키텍처 설계에서의 역할을 이해하고, AWS Well-Architected Framework의 6가지 원칙을 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'demo',
        title: 'AWS Resource Groups & Tag Editor를 활용한 리소스 관리',
        hasContent: true,
        markdownPath: '/content/week1/1-1-tag-editor-lab.md',
        description:
          'AWS 리소스 태그의 개념과 AWS Resource Groups & Tag Editor를 활용한 리소스 관리 방법 학습',
        awsServices: ['AWS Resource Groups & Tag Editor'],
      },
      {
        session: 2,
        type: 'lab',
        title: 'AWS Well-Architected Tool 워크로드 평가',
        hasContent: true,
        markdownPath: '/content/week1/1-2-well-architected-tool-lab.md',
        description:
          'AWS Well-Architected Framework의 6가지 핵심 원칙을 학습하고, Well-Architected Tool로 QuickTable 레스토랑 예약 시스템의 3-Tier 아키텍처를 평가하여 개선 영역을 식별합니다',
        awsServices: ['AWS Well-Architected Tool'],
      },
      {
        session: 3,
        type: 'lab',
        title: 'draw.io로 HA 아키텍처 다이어그램 작성',
        hasContent: true,
        markdownPath: '/content/week1/1-3-drawio-architecture.md',
        description:
          '클라우드 서비스 디자인 개요, 컴퓨팅 서비스 디자인 패턴, 서비스 통합 디자인 패턴',
        awsServices: [],
      },
    ],
    learningObjectives: [
      'AWS 리소스 태그의 개념과 중요성을 이해하고 Tag Editor로 리소스를 관리할 수 있습니다.',
      'Resource Groups를 생성하여 관련 리소스를 그룹화하고 효율적으로 관리할 수 있습니다.',
      'AWS Well-Architected Framework의 6가지 원칙을 설명할 수 있습니다.',
      '원칙 간 트레이드오프를 분석하여 아키텍처 의사결정을 내릴 수 있습니다.',
      '클라우드 서비스 디자인의 핵심 요소와 설계 개념을 설명할 수 있습니다.',
    ],
    prerequisites: ['AWS 기본 개념 이해', '클라우드 컴퓨팅 기초 지식'],
    estimatedTime: '180분',
    difficulty: 'beginner',
  },
  {
    week: 2,
    title: 'AWS IAM 및 조직 관리 고급 전략',
    description:
      'AWS IAM 정책 설계, IAM 역할과 임시 자격증명, AWS Organizations 정책 관리를 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'lab',
        title: 'AWS IAM 정책 Condition 요소 활용',
        hasContent: true,
        markdownPath: '/content/week2/2-1-iam-policy-condition.md',
        description:
          'AWS 인증과 권한, AWS IAM 정책 구조 및 평가 로직, 고급 권한 제어 기법',
        awsServices: ['AWS IAM'],
      },
      {
        session: 2,
        type: 'lab',
        title: 'AWS STS AssumeRole을 활용한 역할 전환',
        hasContent: true,
        markdownPath: '/content/week2/2-2-iam-role-assumerole.md',
        description:
          'AWS IAM 역할 개념 및 임시 자격증명, 신뢰 정책과 권한 정책 구성, AWS STS와 AssumeRole 활용',
        awsServices: ['AWS IAM', 'AWS STS'],
      },
      {
        session: 3,
        type: 'theory',
        title: 'AWS Organizations 정책 관리',
        hasContent: false,
        description:
          'AWS Organizations 구조 및 OU 설계, 서비스 제어 정책(SCP) 구성, 태그 정책 및 거버넌스 자동화',
        awsServices: ['AWS Organizations'],
      },
    ],
    learningObjectives: [
      'AWS IAM 정책의 Condition 요소를 이해하고 설명할 수 있습니다.',
      'MFA 강제, IP 주소 제한, 시간 기반 Condition 정책을 생성할 수 있습니다.',
      '신뢰 정책과 권한 정책의 차이를 이해하고 구성할 수 있습니다.',
      'Condition 정책의 동작을 테스트하고 검증할 수 있습니다.'
    ],
    prerequisites: ['Week 1 완료', 'IAM 기본 개념 이해'],
    estimatedTime: '180분',
    difficulty: 'intermediate',
  },
  {
    week: 3,
    title: 'Amazon VPC 고급 네트워킹',
    description:
      'Amazon VPC 설계 전략과 서브넷 구성, 보안 설계, 네트워크 확장을 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'lab',
        title: 'Amazon VPC Endpoint 생성 및 연결 확인',
        hasContent: true,
        markdownPath: '/content/week3/3-1-vpc-design-strategy.md',
        description:
          'S3 Gateway Endpoint 생성, 라우팅 테이블 확인, 프라이빗 서브넷에서 S3 접근 테스트',
        awsServices: ['Amazon VPC'],
      },
      {
        session: 2,
        type: 'lab',
        title: '3-tier 아키텍처 보안 그룹 및 NACL 구성',
        hasContent: true,
        markdownPath: '/content/week3/3-2-security-group-nacl.md',
        description:
          '다층 방어 네트워크 보안 전략, 보안 그룹과 NACL 비교 및 활용',
        awsServices: ['Amazon VPC'],
      },
      {
        session: 3,
        type: 'theory',
        title: 'Amazon VPC 네트워크 확장',
        hasContent: false,
        description:
          'VPC 확장 전략 및 VPC Peering, 하이브리드 네트워크 연결, AWS Transit Gateway 아키텍처',
        awsServices: ['Amazon VPC'],
      },
    ],
    learningObjectives: [
      '보안 그룹과 NACL의 차이점을 이해하고 설명할 수 있습니다.',
      '3-tier 아키텍처의 각 계층(ALB, Web, App, DB)에 보안 그룹 규칙을 구성할 수 있습니다.',
      'Public/Private 서브넷용 NACL을 생성하고 서브넷에 연결할 수 있습니다.',
      '보안 그룹 체인과 NACL의 동작을 검증할 수 있습니다.'
    ],
    prerequisites: ['Week 1-2 완료', '네트워킹 기본 개념 이해'],
    estimatedTime: '180분',
    difficulty: 'intermediate',
  },
  {
    week: 4,
    title: '서버리스 및 이벤트 기반 아키텍처',
    description:
      '서버리스 아키텍처 설계, API 기반 아키텍처, 이벤트 기반 아키텍처를 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'theory',
        title: '서버리스 아키텍처 설계',
        hasContent: false,
        description:
          '서버리스 컴퓨팅 개념 및 특징, AWS Lambda 동작 원리, AWS Lambda 성능 최적화',
        awsServices: ['AWS Lambda'],
      },
      {
        session: 2,
        type: 'lab',
        title: 'Amazon API Gateway 인증 구성',
        hasContent: true,
        markdownPath: '/content/week4/4-2-lambda-api-gateway-demo.md',
        description:
          'Amazon Cognito User Pool 생성, API Gateway Authorizer 설정, JWT 토큰 기반 인증 테스트',
        awsServices: ['AWS Lambda', 'Amazon API Gateway', 'Amazon Cognito'],
      },
      {
        session: 3,
        type: 'lab',
        title: 'Amazon EventBridge 기반 예약 처리 시스템',
        hasContent: true,
        markdownPath: '/content/week4/4-3-eventbridge-reservation.md',
        description:
          'EventBridge 이벤트 규칙 생성, 이벤트 패턴 정의, 이벤트 기반 워크플로우 테스트',
        awsServices: ['Amazon EventBridge', 'AWS Lambda', 'Amazon DynamoDB'],
      },
    ],
    learningObjectives: [
      'Amazon EventBridge의 이벤트 기반 아키텍처를 이해하고 설명할 수 있습니다.',
      'ReservationCreated 이벤트 규칙을 생성하고 AWS Lambda를 연결할 수 있습니다.',
      'TableUnavailable 이벤트 규칙을 생성하고 알림을 구성할 수 있습니다.',
      '이벤트 기반 워크플로우를 테스트하고 검증할 수 있습니다.'
    ],
    prerequisites: ['Week 1-3 완료', 'REST API 기본 개념 이해'],
    estimatedTime: '180분',
    difficulty: 'intermediate',
  },
  {
    week: 5,
    title: '고성능 데이터베이스 설계',
    description:
      'Amazon RDS 고급 운영, Amazon Aurora 아키텍처, Amazon DynamoDB 고급 설계를 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'demo',
        title: 'Amazon RDS Multi-AZ 고가용성 구성 및 운영',
        hasContent: true,
        markdownPath: '/content/week5/5-1-rds-multi-az.md',
        description:
          'Amazon RDS Multi-AZ 배포, 페일오버 시뮬레이션, Read Replica 및 백업 전략',
        awsServices: ['Amazon RDS'],
      },
      {
        session: 2,
        type: 'theory',
        title: 'Amazon Aurora 아키텍처',
        hasContent: false,
        description:
          'Amazon Aurora 클러스터 아키텍처, Amazon Aurora 고가용성, Amazon Aurora Serverless v2',
        awsServices: ['Amazon Aurora'],
      },
      {
        session: 3,
        type: 'lab',
        title: 'Amazon DynamoDB 테이블 생성 및 보조 인덱스 활용',
        hasContent: true,
        markdownPath: '/content/week5/5-3-dynamodb-design.md',
        description:
          'DynamoDB 테이블 생성, LSI/GSI 인덱스 활용, 데이터 쿼리 및 관리',
        awsServices: ['Amazon DynamoDB'],
      },
    ],
    learningObjectives: [
      'Amazon DynamoDB 테이블을 생성하고 파티션 키/정렬 키를 설계할 수 있습니다.',
      'LSI(Local Secondary Index)를 사용하여 날짜 기반 쿼리를 수행할 수 있습니다.',
      'GSI(Global Secondary Index)를 생성하여 다양한 쿼리 패턴을 지원할 수 있습니다.',
      'Python boto3로 항목을 추가/조회/업데이트하고 쿼리 성능을 비교할 수 있습니다.'
    ],
    prerequisites: ['Week 1-4 완료', '데이터베이스 기본 개념 이해'],
    estimatedTime: '180분',
    difficulty: 'intermediate',
  },
  {
    week: 6,
    title: 'IaC 기반 인프라 자동화',
    description:
      'Infrastructure as Code 개념과 AWS CloudFormation을 활용한 인프라 자동화를 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'demo',
        title: 'AWS CloudFormation 스택 생명주기 관리',
        hasContent: true,
        markdownPath: '/content/week6/6-1-cloudformation-overview.md',
        description:
          'Infrastructure as Code 개념, CloudFormation 동작 원리, 템플릿 구조, 스택 생성/업데이트/삭제, 변경 세트, 드리프트 탐지',
        awsServices: ['AWS CloudFormation'],
      },
      {
        session: 2,
        type: 'lab',
        title: 'AWS CloudFormation 템플릿 분석 및 스택 배포',
        hasContent: true,
        markdownPath: '/content/week6/6-2-cloudformation-template.md',
        description:
          'YAML 문법, Resources/Parameters/Outputs, Intrinsic Functions 이해',
        awsServices: ['AWS CloudFormation', 'Amazon VPC'],
      },
      {
        session: 3,
        type: 'lab',
        title: 'AWS Infrastructure Composer를 활용한 서버리스 템플릿 설계',
        hasContent: true,
        markdownPath: '/content/week6/6-3-infrastructure-composer.md',
        description:
          '비주얼 디자이너로 서버리스 인프라를 설계하고 자동으로 CloudFormation 템플릿을 생성합니다',
        awsServices: ['AWS CloudFormation', 'AWS Infrastructure Composer'],
      },
    ],
    learningObjectives: [
      'AWS Infrastructure Composer의 시각적 설계 기능을 이해할 수 있습니다.',
      'Amazon DynamoDB, AWS Lambda, AWS IAM 역할을 드래그 앤 드롭으로 추가하고 연결할 수 있습니다.',
      'Amazon API Gateway를 추가하고 AWS Lambda 함수와 통합할 수 있습니다.',
      '생성된 AWS CloudFormation 템플릿을 검토하고 배포할 수 있습니다.'
    ],
    prerequisites: [
      'Week 1-5 완료',
      'VPC 및 네트워킹 기본 개념 이해',
      'YAML 기본 문법 이해',
    ],
    estimatedTime: '180분',
    difficulty: 'intermediate',
  },
  {
    week: 7,
    title: '컨테이너 기반 아키텍처',
    description:
      'Docker, Amazon ECS Fargate, Amazon EKS를 통한 컨테이너 인프라 구축 및 오케스트레이션을 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'theory',
        title: '컨테이너 오케스트레이션 기초',
        hasContent: false,
        description:
          '컨테이너와 가상 머신의 차이, Docker 기본 개념, 컨테이너 오케스트레이션 필요성',
        awsServices: ['Amazon EKS', 'Kubernetes'],
      },
      {
        session: 2,
        type: 'theory',
        title: 'Amazon EKS 개요',
        hasContent: false,
        description:
          'Kubernetes 기본 개념, Amazon EKS 아키텍처, 컨트롤 플레인과 데이터 플레인',
        awsServices: ['Amazon EKS', 'Kubernetes'],
      },
      {
        session: 3,
        type: 'lab',
        title: 'kubectl을 활용한 Amazon EKS 클러스터 운영',
        hasContent: true,
        markdownPath: '/content/week7/7-3-eks-cluster-kubectl.md',
        description:
          'Amazon EKS 클러스터 생성 및 kubectl을 활용한 기본 명령 실습',
        awsServices: ['Amazon EKS', 'Kubernetes'],
      },
    ],
    learningObjectives: [
      'Kubernetes의 기본 개념과 Amazon EKS 아키텍처를 이해할 수 있습니다.',
      'kubectl을 구성하고 Amazon EKS 클러스터에 연결할 수 있습니다.',
      'Pod와 Deployment를 생성하고 롤링 업데이트/롤백을 수행할 수 있습니다.',
      'Kubernetes Service를 생성하고 애플리케이션을 외부에 노출할 수 있습니다.'
    ],
    prerequisites: [
      'Week 1-6 완료',
      'Docker 기본 개념 이해',
      'Linux 명령어 기본 지식',
    ],
    estimatedTime: '180분',
    difficulty: 'intermediate',
  },
  {
    week: 8,
    title: '중간고사',
    description: '중간고사',
    sessions: [
      { session: 1, type: 'none', title: '중간고사', hasContent: false },
    ],
    learningObjectives: [],
    prerequisites: ['Week 1-7 완료'],
    estimatedTime: '180분',
    difficulty: 'intermediate',
  },
  {
    week: 9,
    title: 'CI/CD 파이프라인 구축',
    description:
      'AWS Developer Tools를 활용한 컨테이너 CI/CD 파이프라인 구축 및 자동화를 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'theory',
        title: 'DevOps와 CI/CD',
        hasContent: false,
        description: 'DevOps 문화와 원칙, CI/CD 개념, AWS Developer Tools 소개',
        awsServices: [
          'AWS CodeCommit',
          'AWS CodeBuild',
          'AWS CodeDeploy',
          'AWS CodePipeline',
        ],
      },
      {
        session: 2,
        type: 'lab',
        title: 'AWS CodeBuild로 컨테이너 이미지 빌드',
        hasContent: true,
        markdownPath: '/content/week9/9-2-codebuild-container.md',
        description:
          'buildspec.yml 작성, Docker 이미지 빌드, Amazon ECR 자동 푸시',
        awsServices: ['AWS CodeBuild'],
      },
      {
        session: 3,
        type: 'lab',
        title: 'AWS CodePipeline으로 Amazon S3 정적 웹사이트 배포 자동화',
        hasContent: true,
        markdownPath: '/content/week9/9-3-s3-static-website.md',
        description:
          'CodePipeline 구성, CodeBuild 통합, S3 정적 웹사이트 자동 배포',
        awsServices: ['AWS CodePipeline', 'AWS CodeBuild'],
      },
    ],
    learningObjectives: [
      'AWS CodePipeline의 소스-빌드-배포 파이프라인 구조를 이해할 수 있습니다.',
      '프론트엔드 코드를 AWS CodeCommit에 푸시하고 파이프라인을 트리거할 수 있습니다.',
      'AWS CodePipeline을 통해 Amazon S3에 자동 배포되는 과정을 확인할 수 있습니다.',
      '코드 변경 후 자동 배포를 테스트하고 웹사이트를 확인할 수 있습니다.'
    ],
    prerequisites: [
      'Week 1-7 완료',
      'Git 기본 사용법 이해',
      'Docker 및 Kubernetes 기본 개념',
    ],
    estimatedTime: '180분',
    difficulty: 'advanced',
  },
  {
    week: 10,
    title: '캐싱 및 성능 최적화',
    description:
      'Amazon ElastiCache, 데이터베이스 캐싱, Amazon CloudFront를 통한 성능 최적화 전략을 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'theory',
        title: '캐싱 전략',
        hasContent: false,
        description: '캐싱 개념과 필요성, 캐시 전략, TTL과 캐시 무효화',
        awsServices: ['Amazon ElastiCache'],
      },
      {
        session: 2,
        type: 'lab',
        title: 'Amazon ElastiCache 캐싱',
        hasContent: true,
        markdownPath: '/content/week10/10-2-elasticache-caching.md',
        description:
          'Amazon ElastiCache 개요, Amazon ElastiCache 기반 캐싱 아키텍처, Amazon ElastiCache 지원 엔진',
        awsServices: ['Amazon ElastiCache'],
      },
      {
        session: 3,
        type: 'lab',
        title: 'Amazon CloudFront CDN 배포 및 캐싱 전략',
        hasContent: true,
        markdownPath: '/content/week10/10-3-cloudfront-demo.md',
        description:
          'Amazon CloudFront 개요, Amazon CloudFront 캐시 정책, Amazon CloudFront 엣지 컴퓨팅',
        awsServices: ['Amazon CloudFront'],
      },
    ],
    learningObjectives: [
      'CDN의 개념과 Amazon CloudFront의 동작 원리를 이해할 수 있습니다.',
      'Amazon S3 오리진을 준비하고 Amazon CloudFront 배포를 생성할 수 있습니다.',
      '캐시 정책을 구성하고 TTL을 설정할 수 있습니다.',
      '캐시 무효화를 수행하고 Amazon CloudFront 성능을 확인할 수 있습니다.'
    ],
    prerequisites: [
      'Week 1-9 완료',
      '데이터베이스 기본 개념 이해',
      'API 설계 기본 지식',
    ],
    estimatedTime: '180분',
    difficulty: 'advanced',
  },
  {
    week: 11,
    title: '데이터 레이크 및 분석 파이프라인',
    description:
      'Amazon S3 데이터 레이크, AWS Glue, Amazon Athena를 활용한 데이터 파이프라인 구축 및 분석을 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'theory',
        title: '데이터 유형과 파이프라인 개요',
        hasContent: false,
        description:
          '데이터 레이크와 데이터 웨어하우스의 차이, S3 데이터 레이크 아키텍처, 3계층 구조(Raw/Processed/Curated)',
        awsServices: [
          'Amazon S3',
          'AWS Glue',
          'Amazon Athena',
          'AWS Lake Formation',
          'Amazon Quick Suite',
        ],
      },
      {
        session: 2,
        type: 'lab',
        title: 'AWS Glue Crawler 설정 및 Data Catalog 확인',
        hasContent: true,
        markdownPath: '/content/week11/11-2-s3-glue-athena-lab.md',
        description:
          'AWS Glue Crawler로 Data Catalog 생성 및 Amazon Athena로 서버리스 SQL 쿼리 실행',
        awsServices: ['Amazon S3', 'AWS Glue', 'Amazon Athena'],
      },
      {
        session: 3,
        type: 'lab',
        title: 'AWS Glue를 활용한 데이터 파이프라인 구축',
        hasContent: true,
        markdownPath: '/content/week11/11-3-data-pipeline.md',
        description:
          'AWS Glue ETL Job을 활용한 데이터 변환 및 파이프라인 자동화',
        awsServices: ['AWS Glue', 'Amazon Athena', 'Amazon S3'],
      },
    ],
    learningObjectives: [
      'ETL(Extract, Transform, Load)의 개념과 AWS Glue ETL 작업을 이해할 수 있습니다.',
      'AWS Glue ETL 스크립트를 작성하고 데이터 변환 로직을 구현할 수 있습니다.',
      'AWS Glue ETL 작업을 실행하고 변환된 데이터를 확인할 수 있습니다.',
      'Amazon Athena로 변환된 데이터를 쿼리하고 결과를 검증할 수 있습니다.'
    ],
    prerequisites: [
      'Week 1-10 완료',
      'SQL 기본 문법 이해',
      '데이터 처리 기본 개념',
    ],
    estimatedTime: '180분',
    difficulty: 'advanced',
  },
  {
    week: 12,
    title: '보안 자동화 및 컴플라이언스',
    description:
      '자격증명 관리, AWS Config, Amazon GuardDuty를 통한 보안 자동화 및 규정 준수를 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'lab',
        title:
          'AWS Secrets Manager와 AWS Systems Manager를 활용한 자격증명 관리',
        hasContent: true,
        markdownPath: '/content/week12/12-1-credentials-management.md',
        description:
          'Secrets Manager와 Parameter Store를 활용한 안전한 자격증명 및 설정 관리',
        awsServices: ['AWS Systems Manager', 'AWS Secrets Manager'],
      },
      {
        session: 2,
        type: 'lab',
        title: 'AWS Config 규칙 생성 및 모니터링',
        hasContent: true,
        markdownPath: '/content/week12/12-2-aws-config-demo.md',
        description: 'AWS Config Rules를 활용한 리소스 규정 준수 모니터링',
        awsServices: ['AWS Config'],
      },
      {
        session: 3,
        type: 'demo',
        title: 'Amazon GuardDuty와 AWS Lambda 자동 대응',
        hasContent: true,
        markdownPath: '/content/week12/12-3-guardduty-lambda-demo.md',
        description: 'GuardDuty 위협 탐지 및 Lambda를 통한 자동 대응 구현',
        awsServices: ['Amazon GuardDuty', 'AWS Lambda', 'Amazon EventBridge'],
      },
    ],
    learningObjectives: [
      'AWS Config의 개념과 규정 준수 모니터링을 이해할 수 있습니다.',
      'AWS Config를 활성화하고 리소스 구성 변경을 기록할 수 있습니다.',
      '관리형 규칙을 추가하여 Amazon S3 버킷 암호화를 검증할 수 있습니다.',
      '규정 준수 대시보드를 확인하고 비준수 리소스를 수정할 수 있습니다.'
    ],
    prerequisites: [
      'Week 1-11 완료',
      '보안 기본 개념 이해',
      'Lambda 기본 사용법',
    ],
    estimatedTime: '180분',
    difficulty: 'advanced',
  },
  {
    week: 13,
    title: '관측성 아키텍처 설계',
    description:
      '관찰 가능성 3요소(메트릭, 로그, 트레이스)와 AWS X-Ray 분산 추적, 워크로드별 심화 모니터링을 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'theory',
        title: '관찰 가능성 및 Amazon CloudWatch',
        hasContent: false,
        description:
          '관찰 가능성 3요소(메트릭, 로그, 트레이스)의 개념과 역할, Amazon CloudWatch 메트릭 수집 구조, CloudWatch Logs Insights 쿼리 분석',
        awsServices: ['Amazon CloudWatch'],
      },
      {
        session: 2,
        type: 'lab',
        title: 'AWS X-Ray를 활용한 서버리스 애플리케이션 추적',
        hasContent: true,
        markdownPath: '/content/week13/13-2-xray-tracing.md',
        description:
          'AWS X-Ray 구성요소와 분산 추적 방식, 서비스 맵과 트레이스 분석, AWS X-Ray Insights 자동 이상 탐지',
        awsServices: ['AWS X-Ray'],
      },
      {
        session: 3,
        type: 'demo',
        title: 'Amazon CloudWatch Container Insights로 Amazon EKS 모니터링',
        hasContent: true,
        markdownPath: '/content/week13/13-3-container-insights-eks.md',
        description:
          'Amazon CloudWatch Lambda Insights, Container Insights, ServiceLens를 활용한 통합 모니터링',
        awsServices: ['Amazon CloudWatch'],
      },
    ],
    learningObjectives: [
      'Container Insights의 개념과 Amazon EKS 모니터링 구조를 이해할 수 있습니다.',
      'Container Insights를 활성화하고 AWS CloudWatch 에이전트를 배포할 수 있습니다.',
      'AWS CloudWatch 대시보드에서 클러스터 메트릭을 확인할 수 있습니다.',
      'AWS CloudWatch Logs Insights로 컨테이너 로그를 쿼리하고 분석할 수 있습니다.'
    ],
    prerequisites: [
      'Week 1-12 완료',
      '시스템 모니터링 기본 개념 이해',
      'Kubernetes 기본 지식',
    ],
    estimatedTime: '180분',
    difficulty: 'advanced',
  },
  {
    week: 14,
    title: '지능형 클라우드 서비스 설계',
    description:
      'Amazon Bedrock을 활용한 생성형 AI 서비스 구축 및 RAG 시스템 구현을 학습합니다',
    sessions: [
      {
        session: 1,
        type: 'lab',
        title: 'Amazon Bedrock 프롬프트 엔지니어링',
        hasContent: true,
        markdownPath: '/content/week14/14-1-bedrock-prompt-engineering.md',
        description:
          'Amazon Bedrock을 활용한 프롬프트 엔지니어링 기법 학습 및 실습',
        awsServices: ['Amazon Bedrock'],
      },
      {
        session: 2,
        type: 'demo',
        title: 'Amazon Bedrock Knowledge Bases 기반 RAG 구현',
        hasContent: true,
        markdownPath: '/content/week14/14-2-bedrock-knowledge-bases-rag.md',
        description:
          'Bedrock Knowledge Bases를 활용한 RAG(Retrieval-Augmented Generation) 시스템 구축',
        awsServices: ['Amazon Bedrock'],
      },
      {
        session: 3,
        type: 'lab',
        title: 'Amazon Bedrock Agents 기반 고객 지원 챗봇',
        hasContent: true,
        markdownPath: '/content/week14/14-3-bedrock-agent-chatbot.md',
        description: 'Bedrock Agent를 활용한 대화형 고객 지원 챗봇 구현',
        awsServices: ['Amazon Bedrock'],
      },
    ],
    learningObjectives: [
      'Amazon Bedrock Agents의 개념과 자율 에이전트 아키텍처를 이해할 수 있습니다.',
      'AWS Lambda 함수로 Action Group을 생성하고 에이전트와 연결할 수 있습니다.',
      'Amazon Bedrock Knowledge Base를 에이전트에 연결하여 RAG 기능을 통합할 수 있습니다.',
      '에이전트를 테스트하고 다단계 작업을 수행할 수 있습니다.'
    ],
    prerequisites: [
      'Week 1-13 완료',
      'AI/ML 기본 개념 이해',
      'Lambda 및 DynamoDB 사용 경험',
    ],
    estimatedTime: '180분',
    difficulty: 'advanced',
  },
  {
    week: 15,
    title: '기말고사',
    description: '기말고사',
    sessions: [
      { session: 1, type: 'none', title: '기말고사', hasContent: false },
    ],
    learningObjectives: [],
    prerequisites: ['Week 1-14 완료'],
    estimatedTime: '180분',
    difficulty: 'advanced',
  },
];

// 세션 타입별 아이콘 및 레이블
export const sessionTypeConfig = {
  theory: { icon: 'file', label: '이론', color: 'grey', emoji: '📄' },
  lab: { icon: 'settings', label: '실습', color: 'blue', emoji: '🔬' },
  demo: { icon: 'video-on', label: '데모', color: 'green', emoji: '🎥' },
  none: { icon: 'edit', label: '시험', color: 'red', emoji: '📝' },
} as const;
