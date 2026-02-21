# Requirements Document

## Introduction

이 문서는 AWS 실습/데모 가이드에 표준화된 비용 Alert를 자동으로 생성하는 시스템의 요구사항을 정의합니다. 32개 차시(Week 1-1부터 Week 14-3까지)의 CloudFormation 템플릿과 가이드 파일을 분석하여 사용되는 모든 AWS 리소스를 추출하고, 최신 온디맨드 요금 정보를 기반으로 정확한 비용 정보를 제공합니다.

## Glossary

- **System**: Cost Alert Generation System (비용 Alert 생성 시스템)
- **Guide_File**: 실습 또는 데모 가이드 마크다운 파일 (.md)
- **CloudFormation_Template**: AWS 리소스를 정의하는 YAML 파일 (.yaml)
- **Resource**: AWS 서비스 리소스 (EC2, RDS, Lambda 등)
- **IaC**: Infrastructure as Code (CloudFormation으로 생성되는 리소스)
- **Manual_Resource**: 가이드에서 수동으로 생성하는 리소스
- **Cost_Alert**: 표준 형식의 비용 정보 마크다운 Alert
- **Region**: AWS 리전 (기본: ap-northeast-2, Bedrock: us-east-1)
- **On_Demand_Pricing**: AWS 온디맨드 요금 (시간당 기준)

## Requirements

### Requirement 1: CloudFormation 템플릿 분석

**User Story:** As a developer, I want to analyze CloudFormation templates, so that I can extract all IaC resources and their specifications.

#### Acceptance Criteria

1. WHEN a CloudFormation template file path is provided, THE System SHALL read the YAML file and parse its contents
2. THE System SHALL extract all resource types from the Resources section
3. THE System SHALL extract resource specifications (instance types, storage sizes, etc.)
4. WHEN a resource has a Type property, THE System SHALL identify the AWS service name
5. THE System SHALL store extracted resources with their type and specification information
6. IF a CloudFormation template does not exist for a session, THEN THE System SHALL mark IaC as not applicable

### Requirement 2: 가이드 파일 분석

**User Story:** As a developer, I want to analyze guide markdown files, so that I can extract manually created resources from task descriptions.

#### Acceptance Criteria

1. WHEN a guide file path is provided, THE System SHALL read the markdown file
2. THE System SHALL identify task sections (태스크 1, 태스크 2, etc.)
3. WHEN a task contains AWS service creation steps, THE System SHALL extract the service name and type
4. THE System SHALL identify resource specifications from step descriptions (t3.micro, db.t3.micro, etc.)
5. THE System SHALL distinguish between IaC resources and manual resources
6. THE System SHALL store manual resources separately from IaC resources

### Requirement 3: AWS 요금 정보 수집

**User Story:** As a developer, I want to collect accurate AWS pricing information, so that I can provide correct cost estimates.

#### Acceptance Criteria

1. THE System SHALL maintain a pricing database for ap-northeast-2 region
2. THE System SHALL maintain a pricing database for us-east-1 region (Bedrock services)
3. WHEN a resource type is identified, THE System SHALL look up its hourly on-demand price
4. THE System SHALL store prices in USD with precision to 4 decimal places
5. THE System SHALL identify free-tier resources and mark them as "무료"
6. IF a resource price is not found, THEN THE System SHALL flag it for manual review
7. THE System SHALL provide AWS pricing page URLs for each service category

### Requirement 4: 비용 Alert 생성

**User Story:** As a developer, I want to generate standardized cost alerts, so that students can understand resource costs before starting labs.

#### Acceptance Criteria

1. THE System SHALL generate cost alerts in markdown format
2. THE System SHALL use the standard title format: "리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)"
3. THE System SHALL create a table with columns: 리소스명 | 타입/사양 | IaC | 비용
4. THE System SHALL support flexible pricing units (per hour, per token, per request, per GB, etc.)
5. WHEN a resource has multiple pricing components (e.g., Bedrock input/output tokens), THE System SHALL create separate table rows for each component
6. WHEN a resource is created by CloudFormation, THE System SHALL mark IaC column with ✅
7. WHEN a resource is created manually, THE System SHALL mark IaC column with ❌
8. THE System SHALL calculate estimated total cost per hour (for hourly-billed resources)
9. THE System SHALL include estimated lab duration (1-2시간 기본)
10. THE System SHALL include free plan notice
11. THE System SHALL include region-specific pricing disclaimer
12. THE System SHALL include AWS pricing page links

### Requirement 5: 실무 팁 생성

**User Story:** As a developer, I want to generate practical tips, so that students can learn cost optimization strategies.

#### Acceptance Criteria

1. WHEN a high-cost resource is detected (NAT Gateway, RDS, etc.), THE System SHALL generate a cost optimization tip
2. THE System SHALL provide alternative solutions for expensive resources
3. WHEN instance types are used, THE System SHALL include instance type cost comparison warning
4. THE System SHALL format tips with 💡 emoji prefix
5. THE System SHALL limit tips to relevant and actionable information

### Requirement 6: 표준 형식 준수

**User Story:** As a developer, I want alerts to follow standard format, so that all guides have consistent cost information.

#### Acceptance Criteria

1. THE System SHALL use [!COST] alert type
2. THE System SHALL use AWS service full names (Amazon S3, AWS Lambda, Amazon DynamoDB)
3. THE System SHALL align table columns properly (left, left, center, right)
4. THE System SHALL include "무료 플랜" section
5. THE System SHALL include "실무 팁" section when applicable
6. THE System SHALL include "참고" section for instance type warnings when applicable
7. THE System SHALL include pricing disclaimer text
8. THE System SHALL include service-specific pricing links

### Requirement 7: 배치 처리

**User Story:** As a developer, I want to process all 32 sessions, so that I can generate cost alerts for the entire curriculum.

#### Acceptance Criteria

1. THE System SHALL process sessions from Week 1-1 to Week 14-3
2. THE System SHALL handle missing CloudFormation templates gracefully
3. THE System SHALL handle missing guide files gracefully
4. THE System SHALL generate a summary report of processed sessions
5. THE System SHALL identify sessions that require manual review
6. THE System SHALL output generated alerts to designated files or console

### Requirement 8: 데이터 검증

**User Story:** As a developer, I want to validate extracted data, so that I can ensure accuracy before generating alerts.

#### Acceptance Criteria

1. THE System SHALL validate that all resource types are recognized AWS services
2. THE System SHALL validate that all prices are positive numbers or "무료"
3. THE System SHALL validate that IaC markers are either ✅ or ❌
4. THE System SHALL validate that estimated costs are calculated correctly
5. IF validation fails, THEN THE System SHALL report the error with session identifier
6. THE System SHALL provide a validation summary at the end of batch processing

### Requirement 9: Parser와 Pretty Printer

**User Story:** As a developer, I want to parse and format cost alert data, so that I can maintain data integrity through round-trip operations.

#### Acceptance Criteria

1. WHEN a cost alert markdown is provided, THE Parser SHALL parse it into a structured Cost_Alert object
2. THE Parser SHALL extract table data into a list of Resource objects
3. THE Parser SHALL extract metadata (title, region, estimated time, total cost)
4. THE Parser SHALL extract tips and warnings
5. THE Pretty_Printer SHALL format Cost_Alert objects back into valid markdown
6. FOR ALL valid Cost_Alert objects, parsing then printing then parsing SHALL produce an equivalent object (round-trip property)
7. IF parsing fails, THEN THE Parser SHALL return a descriptive error with line number

### Requirement 10: 리소스 타입 매핑

**User Story:** As a developer, I want to map CloudFormation resource types to service names, so that I can generate accurate cost information.

#### Acceptance Criteria

1. THE System SHALL maintain a mapping of CloudFormation types to AWS service names
2. WHEN a CloudFormation type is "AWS::EC2::Instance", THE System SHALL map it to "Amazon EC2"
3. WHEN a CloudFormation type is "AWS::RDS::DBInstance", THE System SHALL map it to "Amazon RDS"
4. WHEN a CloudFormation type is "AWS::Lambda::Function", THE System SHALL map it to "AWS Lambda"
5. THE System SHALL handle all common AWS service types
6. IF a CloudFormation type is not recognized, THEN THE System SHALL flag it for manual review

### Requirement 11: 특수 리전 처리

**User Story:** As a developer, I want to handle special region requirements, so that I can provide accurate pricing for region-specific services.

#### Acceptance Criteria

1. WHEN a session uses Amazon Bedrock, THE System SHALL use us-east-1 pricing
2. WHEN a session uses standard services, THE System SHALL use ap-northeast-2 pricing
3. THE System SHALL update the alert title to reflect the correct region
4. THE System SHALL include region-specific pricing links
5. THE System SHALL identify Bedrock sessions automatically (Week 14-1, 14-2, 14-3)

### Requirement 12: 비용 계산 정확성

**User Story:** As a developer, I want to calculate costs accurately, so that students receive reliable cost estimates.

#### Acceptance Criteria

1. THE System SHALL sum all hourly costs to calculate total cost per hour
2. THE System SHALL exclude free resources from cost calculation
3. THE System SHALL round total costs to 2 decimal places
4. WHEN estimated lab duration is provided, THE System SHALL calculate total lab cost
5. THE System SHALL format costs with $ prefix and proper decimal places
6. THE System SHALL include disclaimer about data transfer costs

---

### Requirement 13: 톤 및 스타일 가이드

**User Story:** As a developer, I want to maintain consistent tone and style, so that cost alerts are educational and non-threatening.

#### Acceptance Criteria

1. THE System SHALL use informational tone (not warning tone)
2. THE System SHALL avoid excessive cost emphasis
3. THE System SHALL maintain educational context
4. THE System SHALL use [!COST] alert type (not [!WARNING])
5. THE System SHALL present costs as learning opportunities, not threats

---

### Requirement 14: 비용 정보 출처 관리

**User Story:** As a developer, I want to track pricing data sources, so that I can update prices when AWS changes them.

#### Acceptance Criteria

1. THE System SHALL maintain a list of AWS official pricing page URLs for each service
2. THE System SHALL include pricing page URLs in generated alerts
3. THE System SHALL document the date when pricing data was last updated
4. THE System SHALL provide instructions for updating pricing data
5. THE pricing database SHALL include source URLs as metadata for each price entry

---

### Requirement 15: Alert 배치 위치 가이드

**User Story:** As a developer, I want to know where to place cost alerts, so that students see them at the right time.

#### Acceptance Criteria

1. THE System SHALL generate alerts suitable for placement after Front Matter
2. THE generated alert format SHALL be compatible with markdown guide structure
3. THE System documentation SHALL specify recommended placement locations:
   - After Front Matter (primary location)
   - Before task sections (optional)
   - In resource cleanup section (optional)
4. THE System SHALL support generating alerts for both lab guides and demo guides

---

### Requirement 16: 실무 온디맨드 비용 계산

**User Story:** As a developer, I want to calculate costs based on real on-demand pricing, so that students understand actual production costs.

#### Acceptance Criteria

1. THE System SHALL calculate "예상 총 비용" based on real on-demand pricing without free tier discounts
2. THE System SHALL include hourly-billed resources in total cost calculation (EC2, RDS, ElastiCache, NAT Gateway, EKS, etc.)
3. THE System SHALL exclude token-based, request-based, and storage-based resources from hourly total cost
4. THE System SHALL maintain free plan information section as educational reference only
5. THE System SHALL NOT subtract free tier allowances from total cost calculation
6. THE System SHALL present costs as "실무 환경 온디맨드 기준" to clarify the calculation basis
7. WHEN a resource has free tier, THE System SHALL still show its on-demand price in the table
8. THE free plan section SHALL inform students about available credits and free tier limits without affecting cost totals
