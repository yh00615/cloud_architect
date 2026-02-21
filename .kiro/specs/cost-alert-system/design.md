# Design Document

## Overview

The Cost Alert Generation System is a batch processing tool that analyzes AWS lab guides and CloudFormation templates to automatically generate standardized cost information alerts. The system processes 32 sessions (Week 1-1 through Week 14-3), extracting AWS resource information from both Infrastructure as Code (CloudFormation YAML) and manual creation steps (markdown guides), then generates formatted cost alerts with accurate pricing information.

### Key Design Goals

1. **Accuracy**: Provide precise AWS on-demand pricing for ap-northeast-2 and us-east-1 regions
2. **Automation**: Process all 32 sessions with minimal manual intervention
3. **Standardization**: Generate consistent cost alerts following the established format
4. **Maintainability**: Use round-trip parsers to ensure data integrity
5. **Extensibility**: Support easy addition of new AWS services and pricing updates

### System Boundaries

**In Scope:**

- CloudFormation YAML parsing
- Markdown guide parsing
- AWS pricing database management
- Cost alert markdown generation
- Batch processing of 32 sessions
- Validation and error reporting

**Out of Scope:**

- Real-time AWS Pricing API integration
- Cost tracking for running resources
- Multi-region pricing comparison
- Reserved instance or Savings Plan pricing
- Data transfer cost calculation (mentioned in disclaimer only)

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Batch Processor                         │
│  (Orchestrates processing of 32 sessions)                   │
└────────────┬────────────────────────────────────────────────┘
             │
             ├──────────────┬──────────────┬──────────────────┐
             │              │              │                  │
             ▼              ▼              ▼                  ▼
┌─────────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
│ CloudFormation  │ │    Guide     │ │   Pricing   │ │    Alert     │
│     Parser      │ │    Parser    │ │   Database  │ │  Generator   │
└─────────────────┘ └──────────────┘ └─────────────┘ └──────────────┘
         │                  │              │                  │
         └──────────────────┴──────────────┴──────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Cost Alert      │
                  │  (Markdown)      │
                  └──────────────────┘
```

### Data Flow

1. **Input Phase**: Batch Processor reads session metadata (week, session, title, region)
2. **Extraction Phase**:
   - CloudFormation Parser extracts IaC resources
   - Guide Parser extracts manual resources
3. **Enrichment Phase**: Pricing Database provides cost information for each resource
4. **Generation Phase**: Alert Generator creates standardized markdown
5. **Validation Phase**: Validate generated alert and report any issues
6. **Output Phase**: Write alert to file or console

## Components and Interfaces

### 1. Batch Processor

**Responsibility**: Orchestrate the processing of all 32 sessions sequentially.

**Interface**:

```typescript
interface BatchProcessor {
  processSessions(sessions: SessionInfo[]): BatchResult;
}

interface SessionInfo {
  week: number; // 1-14
  session: number; // 1-3
  title: string; // e.g., "Amazon VPC Endpoint 생성"
  region: Region; // "ap-northeast-2" | "us-east-1"
  hasCloudFormation: boolean;
  hasGuide: boolean;
}

interface BatchResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  manualReviewRequired: SessionInfo[];
  errors: ProcessingError[];
}
```

**Key Operations**:

- Load session metadata from configuration
- Iterate through sessions in order (1-1, 1-2, ..., 14-3)
- Handle missing files gracefully
- Collect and report errors
- Generate summary report

### 2. CloudFormation Parser

**Responsibility**: Parse CloudFormation YAML templates and extract resource information.

**Interface**:

```typescript
interface CloudFormationParser {
  parse(filePath: string): CloudFormationResources;
}

interface CloudFormationResources {
  resources: Resource[];
  errors: string[];
}

interface Resource {
  name: string; // Logical resource name
  type: string; // CloudFormation type (e.g., "AWS::EC2::Instance")
  serviceName: string; // AWS service name (e.g., "Amazon EC2")
  specification: string; // e.g., "t3.micro", "db.t3.micro"
  isIaC: boolean; // Always true for CloudFormation resources
}
```

**Key Operations**:

- Read and parse YAML file
- Extract Resources section
- Map CloudFormation types to AWS service names
- Extract specifications from Properties (InstanceType, DBInstanceClass, etc.)
- Handle parsing errors gracefully

### 3. Guide Parser

**Responsibility**: Parse markdown guide files and extract manually created resources.

**Interface**:

```typescript
interface GuideParser {
  parse(filePath: string): GuideResources;
}

interface GuideResources {
  resources: Resource[];
  errors: string[];
}
```

**Key Operations**:

- Read markdown file
- Identify task sections (## 태스크 1, ## 태스크 2, etc.)
- Extract AWS service creation steps
- Identify resource specifications (t3.micro, cache.t3.micro, etc.)
- Mark resources as manual (isIaC: false)

### 4. Pricing Database

**Responsibility**: Provide accurate AWS on-demand pricing information.

**Interface**:

```typescript
interface PricingDatabase {
  getPrice(serviceName: string, specification: string, region: Region): PriceInfo
  getPricingUrl(serviceName: string): string
}

interface PriceInfo {
  hourlyRate: number | "무료"  // USD per hour, or free
  isFreeT tier: boolean
}

type Region = "ap-northeast-2" | "us-east-1"
```

**Data Structure**:

```typescript
interface PricingData {
  region: Region
  lastUpdated: string // ISO 8601 date string
  services: {
    [serviceName: string]: {
      [specification: string]: {
        hourlyRate: number
        isFreeT tier: boolean
        pricingUnit: string // "시간", "1K 토큰", "100만 요청", "GB/월"
        sourceUrl: string // Official AWS pricing page URL
        notes?: string // Optional notes (e.g., "데이터 처리 비용 별도")
      }
    }
  }
  pricingUrls: {
    [serviceName: string]: string
  }
}
```

**Key Operations**:

- Look up pricing by service name, specification, and region
- Return "무료" for free-tier resources
- Provide AWS pricing page URLs
- Flag unknown resources for manual review

### 5. Alert Generator

**Responsibility**: Generate standardized cost alert markdown from resource and pricing data.

**Interface**:

```typescript
interface AlertGenerator {
  generate(input: AlertInput): string;
}

interface AlertInput {
  session: SessionInfo;
  resources: Resource[];
  prices: Map<Resource, PriceInfo>;
  estimatedDuration: string; // e.g., "1-2시간"
}
```

**Key Operations**:

- Format alert title with region
- Generate resource table with proper alignment
- Calculate total hourly cost
- Generate practical tips for high-cost resources
- Include free plan notice
- Include pricing disclaimer and links
- Validate output format

### 6. Cost Alert Parser & Pretty Printer

**Responsibility**: Parse cost alert markdown into structured data and format it back (round-trip).

**Interface**:

```typescript
interface CostAlertParser {
  parse(markdown: string): Result<CostAlert, ParseError>;
}

interface CostAlertPrettyPrinter {
  print(alert: CostAlert): string;
}

interface CostAlert {
  title: string;
  region: Region;
  resources: ResourceRow[];
  estimatedDuration: string;
  totalHourlyCost: number;
  freePlanNotice: string;
  tips: string[];
  warnings: string[];
  disclaimer: string;
  pricingLinks: string[];
}

interface ResourceRow {
  name: string;
  typeSpec: string;
  isIaC: boolean;
  hourlyCost: string; // "$0.0126" or "무료"
}

interface ParseError {
  message: string;
  lineNumber: number;
}
```

**Key Operations**:

- Parse markdown table into ResourceRow objects
- Extract metadata from alert structure
- Validate alert format
- Pretty print CostAlert back to markdown
- Ensure round-trip property: parse(print(alert)) ≈ alert

## Data Models

### Session Information

```typescript
interface SessionInfo {
  week: number; // 1-14
  session: number; // 1-3
  title: string; // Session title in Korean
  region: Region; // AWS region for pricing
  hasCloudFormation: boolean;
  hasGuide: boolean;
  cloudFormationPath?: string; // e.g., "public/files/week3/3-1-lab-template.yaml"
  guidePath?: string; // e.g., "public/guides/week3/3-1-lab.md"
}
```

### Resource Information

```typescript
interface Resource {
  name: string; // Resource name (e.g., "Amazon EC2", "NAT Gateway")
  type: string; // CloudFormation type or service type
  serviceName: string; // Standardized AWS service name
  specification: string; // Instance type, size, etc.
  isIaC: boolean; // true if from CloudFormation, false if manual
  source: 'cloudformation' | 'guide';
}
```

### Pricing Information

```typescript
interface PriceInfo {
  hourlyRate: number | "무료"
  isFreeT tier: boolean
  pricingUrl: string
  notes?: string  // e.g., "데이터 처리 비용 별도"
}
```

### Cost Alert Structure

```typescript
interface CostAlert {
  // Metadata
  title: string; // "리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)"
  region: Region;

  // Resource table
  resources: ResourceRow[];

  // Cost summary
  estimatedDuration: string; // "1-2시간"
  totalHourlyCost: number; // Sum of all non-free resources
  estimatedTotalCost: string; // "$0.05-0.10"

  // Additional sections
  freePlanNotice: string;
  tips: string[]; // Practical tips with 💡 prefix
  warnings: string[]; // Instance type warnings
  disclaimer: string;
  pricingLinks: string[];
}

interface ResourceRow {
  name: string; // "Amazon EC2" or "Amazon Bedrock"
  typeSpec: string; // "t3.micro" or "Claude 3 Haiku (입력)"
  isIaC: boolean; // true → ✅, false → ❌
  cost: string; // "$0.0126/시간" or "$0.00025/1K 토큰" or "무료"
  pricingUnit?: string; // "시간", "1K 토큰", "100만 요청", "GB/월" (optional, for internal use)
}
```

### Validation Result

```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  type:
    | 'unknown_service'
    | 'invalid_price'
    | 'missing_field'
    | 'calculation_error';
  message: string;
  resource?: Resource;
  sessionInfo?: SessionInfo;
}

interface ValidationWarning {
  type: 'manual_review_required' | 'missing_pricing' | 'deprecated_service';
  message: string;
  resource?: Resource;
}
```

### Batch Processing Result

```typescript
interface BatchResult {
  totalProcessed: number;
  successful: number;
  failed: number;
  manualReviewRequired: SessionInfo[];
  errors: ProcessingError[];
  summary: {
    totalResources: number;
    iacResources: number;
    manualResources: number;
    freeResources: number;
    paidResources: number;
  };
}

interface ProcessingError {
  session: SessionInfo;
  phase: 'parsing' | 'pricing' | 'generation' | 'validation';
  error: string;
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property Reflection

Before defining properties, I analyzed all acceptance criteria for redundancy:

**Redundancies Identified:**

1. Properties 1.2, 1.3, 1.5 (CloudFormation extraction) can be combined into one comprehensive property about complete resource extraction
2. Properties 2.2, 2.3, 2.4, 2.6 (Guide parsing) can be combined into one property about complete manual resource extraction
3. Properties 4.4 and 4.5 (IaC markers) are redundant - one property covers both cases
4. Properties 6.4, 6.5, 6.6, 6.7, 6.8 (alert sections) can be combined into one property about complete alert structure
5. Properties 8.1, 8.2, 8.3 (validation) can be combined into one comprehensive validation property
6. Properties 10.2, 10.3, 10.4 (specific mappings) are examples of 10.5 (general mapping property)

**Properties After Reflection:**
After eliminating redundancies, we have 25 unique properties that provide comprehensive coverage without overlap.

### Property 1: CloudFormation YAML Round-Trip

_For any_ valid CloudFormation YAML template, parsing it and then serializing it back to YAML should produce a semantically equivalent template.

**Validates: Requirements 1.1**

**Rationale**: This ensures the YAML parser correctly handles CloudFormation syntax without data loss.

### Property 2: Complete Resource Extraction from CloudFormation

_For any_ CloudFormation template with a Resources section, parsing should extract all resources with their complete specifications (type, properties, and logical name).

**Validates: Requirements 1.2, 1.3, 1.5**

**Rationale**: This ensures no resources are missed during extraction and all relevant information is captured.

### Property 3: CloudFormation Type Mapping

_For any_ recognized CloudFormation resource type (e.g., "AWS::EC2::Instance"), the system should map it to the correct AWS service name (e.g., "Amazon EC2").

**Validates: Requirements 1.4, 10.5**

**Rationale**: This ensures consistent service naming across the system.

### Property 4: Complete Manual Resource Extraction from Guides

_For any_ guide markdown file with task sections containing AWS service creation steps, parsing should extract all manually created resources with their specifications.

**Validates: Requirements 2.2, 2.3, 2.4, 2.6**

**Rationale**: This ensures manual resources are identified and extracted completely from guide text.

### Property 5: IaC vs Manual Resource Distinction

_For any_ resource, it should be correctly classified as either IaC (from CloudFormation) or manual (from guide), but not both.

**Validates: Requirements 2.5**

**Rationale**: This ensures clear separation between infrastructure code and manual steps.

### Property 6: Pricing Lookup Accuracy

_For any_ known AWS service and specification in a given region, the pricing database should return the correct hourly on-demand rate with 4 decimal places precision.

**Validates: Requirements 3.3, 3.4**

**Rationale**: This ensures pricing accuracy, which is critical for cost estimates.

### Property 7: Free-Tier Resource Identification

_For any_ AWS resource that qualifies for free tier, the system should mark it as having free tier availability in metadata, but still include its on-demand price in cost calculations.

**Validates: Requirements 3.5, 16.4, 16.5, 16.7**

**Rationale**: This ensures students know which resources have free tier options while understanding the actual on-demand costs. Free tier information is educational and does not affect total cost calculations, which are based on real production pricing.

### Property 8: Cost Alert Markdown Generation

_For any_ set of resources with pricing information, the generated cost alert should be valid markdown that follows the standard format.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5**

**Rationale**: This ensures all generated alerts are consistently formatted and parseable, supporting flexible pricing units and multi-component resources.

### Property 9: IaC Marker Correctness

_For any_ resource in a generated alert, the IaC column should be ✅ if and only if the resource is from CloudFormation, otherwise ❌.

**Validates: Requirements 4.6, 4.7**

**Rationale**: This ensures students can distinguish between pre-created and manually created resources.

### Property 10: Total Cost Calculation

_For any_ set of resources with hourly costs, the total hourly cost should equal the sum of all hourly-billed resource costs (regardless of free tier status), rounded to 2 decimal places.

**Validates: Requirements 4.8, 12.1, 12.3, 16.1, 16.2, 16.3**

**Rationale**: This ensures accurate cost summation based on real on-demand pricing without free tier discounts. Only hourly-billed resources (EC2, RDS, ElastiCache, NAT Gateway, EKS, etc.) are included in total cost calculation; token-based, request-based, or storage-based resources are excluded. Free tier information is maintained separately for educational purposes but does not affect the total cost calculation.

### Property 11: Complete Alert Structure

_For any_ generated cost alert, it should include all required sections: title, resource table, estimated duration, total cost, free plan notice, disclaimer, and pricing links.

**Validates: Requirements 4.9, 4.10, 4.11, 4.12, 6.4, 6.7, 6.8**

**Rationale**: This ensures no required information is missing from alerts.

### Property 12: High-Cost Resource Tips

_For any_ session containing high-cost resources (NAT Gateway, RDS, ElastiCache), the generated alert should include at least one practical tip with 💡 prefix.

**Validates: Requirements 5.1, 5.2, 5.4**

**Rationale**: This ensures students receive cost optimization guidance when needed.

### Property 13: Instance Type Warning

_For any_ session using EC2 or RDS instance types, the generated alert should include an instance type cost comparison warning.

**Validates: Requirements 5.3**

**Rationale**: This educates students about instance type pricing variations.

### Property 14: AWS Service Name Standardization

_For any_ AWS service mentioned in a generated alert, it should use the full official name (e.g., "Amazon S3" not "S3", "AWS Lambda" not "Lambda").

**Validates: Requirements 6.2**

**Rationale**: This ensures professional and consistent service naming.

### Property 15: Table Column Alignment

_For any_ generated resource table, columns should be aligned as: left (리소스명), left (타입/사양), center (IaC), right (비용).

**Validates: Requirements 6.3**

**Rationale**: This ensures tables are readable and professionally formatted.

### Property 16: Batch Processing Completeness

_For all_ 32 sessions (Week 1-1 through Week 14-3), the batch processor should attempt to process each one exactly once.

**Validates: Requirements 7.1**

**Rationale**: This ensures no sessions are skipped or processed multiple times.

### Property 17: Graceful Handling of Missing Files

_For any_ session with missing CloudFormation template or guide file, the system should continue processing other sessions without crashing.

**Validates: Requirements 7.2, 7.3**

**Rationale**: This ensures robustness in the face of incomplete data.

### Property 18: Validation Completeness

_For any_ generated cost alert, all resource types should be recognized AWS services, all prices should be positive or "무료", and all IaC markers should be ✅ or ❌.

**Validates: Requirements 8.1, 8.2, 8.3**

**Rationale**: This ensures data quality before output.

### Property 19: Cost Calculation Validation

_For any_ generated cost alert, the stated total cost should equal the sum of individual resource costs (excluding free resources).

**Validates: Requirements 8.4**

**Rationale**: This catches calculation errors before output.

### Property 20: Error Reporting with Context

_For any_ validation error, the error report should include the session identifier (week and session number).

**Validates: Requirements 8.5**

**Rationale**: This enables quick identification and fixing of issues.

### Property 21: Cost Alert Round-Trip

_For any_ valid cost alert markdown, parsing it then pretty-printing it then parsing again should produce an equivalent CostAlert object.

**Validates: Requirements 9.6**

**Rationale**: This ensures the parser and pretty printer are inverses of each other, maintaining data integrity.

### Property 22: Parser Error Messages

_For any_ invalid cost alert markdown, the parser should return a descriptive error message including the line number where parsing failed.

**Validates: Requirements 9.7**

**Rationale**: This helps debug malformed alerts quickly.

### Property 23: Bedrock Region Detection

_For any_ session in Week 14 (sessions 14-1, 14-2, 14-3), the system should automatically use us-east-1 region and pricing.

**Validates: Requirements 11.5**

**Rationale**: This ensures Bedrock services use the correct region without manual configuration.

### Property 24: Region-Specific Pricing

_For any_ session, all resources should use pricing from the session's designated region (ap-northeast-2 or us-east-1).

**Validates: Requirements 11.1, 11.2, 11.3, 11.4**

**Rationale**: This ensures pricing accuracy for region-specific services.

### Property 25: Cost Formatting Consistency

_For any_ cost value in a generated alert, it should be formatted with $ prefix and exactly 2 decimal places (e.g., "$0.05" not "$0.0500" or "0.05").

**Validates: Requirements 12.5**

**Rationale**: This ensures professional and consistent cost presentation.

### Property 26: Informational Tone

_For any_ generated cost alert, it should use [!COST] alert type and maintain an educational, informational tone without excessive warnings.

**Validates: Requirements 13.1, 13.2, 13.3, 13.4, 13.5**

**Rationale**: This ensures cost information is presented as a learning opportunity rather than a threat, maintaining the educational context.

### Property 27: Pricing Source Traceability

_For any_ price in the pricing database, it should have an associated source URL pointing to the official AWS pricing page.

**Validates: Requirements 14.1, 14.2, 14.5**

**Rationale**: This ensures pricing data can be verified and updated when AWS changes their prices.

## Error Handling

### Error Categories

#### 1. File System Errors

- **Missing CloudFormation Template**: Log warning, mark session as "no IaC", continue processing
- **Missing Guide File**: Log warning, mark session as "no manual resources", continue processing
- **File Read Error**: Log error with file path, skip session, continue batch

#### 2. Parsing Errors

- **Invalid YAML**: Log error with line number, skip CloudFormation parsing, continue with guide
- **Invalid Markdown**: Log error with line number, skip guide parsing, continue with CloudFormation
- **Malformed Table**: Log error, attempt partial parsing, flag for manual review

#### 3. Data Errors

- **Unknown Resource Type**: Log warning, flag for manual review, use placeholder pricing
- **Missing Pricing**: Log warning, flag for manual review, mark as "가격 미확인"
- **Invalid Specification**: Log warning, use generic pricing if available

#### 4. Validation Errors

- **Cost Calculation Mismatch**: Log error, recalculate, flag for manual review
- **Missing Required Section**: Log error, add placeholder section, flag for manual review
- **Invalid Format**: Log error, attempt to fix, flag for manual review

### Error Recovery Strategies

#### Graceful Degradation

```typescript
function processSession(
  session: SessionInfo,
): Result<CostAlert, ProcessingError> {
  let resources: Resource[] = [];

  // Try CloudFormation parsing
  try {
    const cfResources = cloudFormationParser.parse(session.cloudFormationPath);
    resources.push(...cfResources.resources);
  } catch (error) {
    logger.warn(
      `CloudFormation parsing failed for ${session.week}-${session.session}: ${error}`,
    );
    // Continue without CloudFormation resources
  }

  // Try Guide parsing
  try {
    const guideResources = guideParser.parse(session.guidePath);
    resources.push(...guideResources.resources);
  } catch (error) {
    logger.warn(
      `Guide parsing failed for ${session.week}-${session.session}: ${error}`,
    );
    // Continue without guide resources
  }

  // If no resources found, flag for manual review
  if (resources.length === 0) {
    return Err({
      session,
      phase: 'parsing',
      error: 'No resources found in CloudFormation or Guide',
    });
  }

  // Continue with alert generation...
}
```

#### Partial Success Handling

- If CloudFormation parsing fails but guide parsing succeeds, generate alert with manual resources only
- If pricing is missing for some resources, include them with "가격 미확인" and flag session
- If validation fails, output alert with warnings and flag for manual review

### Error Reporting

#### Console Output

```
Processing Session 3-1: Amazon VPC Endpoint 생성
  ✓ CloudFormation parsed: 5 resources
  ✓ Guide parsed: 1 resource
  ✓ Pricing lookup: 6/6 successful
  ✓ Alert generated
  ✓ Validation passed

Processing Session 5-3: Amazon DynamoDB 테이블 생성
  ⚠ CloudFormation not found
  ✓ Guide parsed: 1 resource
  ✓ Pricing lookup: 1/1 successful
  ✓ Alert generated
  ✓ Validation passed

Processing Session 14-1: Amazon Bedrock 프롬프트 엔지니어링
  ✗ CloudFormation parsing failed: Invalid YAML at line 42
  ✓ Guide parsed: 1 resource
  ⚠ Pricing lookup: 0/1 successful (Bedrock pricing not in database)
  ⚠ Alert generated with warnings
  ⚠ Manual review required

Summary:
  Total: 32 sessions
  Successful: 29
  Warnings: 2
  Failed: 1
  Manual Review Required: 3
```

#### Error Log File

```json
{
  "timestamp": "2025-02-20T10:30:00Z",
  "session": "14-1",
  "phase": "pricing",
  "error": "Pricing not found for Amazon Bedrock (Anthropic Claude 3)",
  "severity": "warning",
  "action": "Manual review required"
}
```

### Validation Rules

#### Pre-Generation Validation

1. All resources must have a service name
2. All resources must have a specification (or "N/A")
3. All resources must have isIaC flag set
4. All resources must have pricing info (or flagged as missing)

#### Post-Generation Validation

1. Alert must have title with region
2. Alert must have at least one resource
3. Total cost must equal sum of individual costs
4. All required sections must be present
5. All markdown syntax must be valid

#### Validation Failure Actions

- **Critical**: Stop processing, report error, do not output alert
- **Warning**: Output alert with warning marker, flag for manual review
- **Info**: Log information, continue processing

## Testing Strategy

### Dual Testing Approach

This system requires both unit tests and property-based tests to ensure correctness:

- **Unit Tests**: Verify specific examples, edge cases, and error conditions
- **Property Tests**: Verify universal properties across all inputs using randomization

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness.

### Property-Based Testing Configuration

**Library Selection**:

- TypeScript: `fast-check` (recommended for Node.js/TypeScript projects)
- Python: `hypothesis` (if implementing in Python)

**Configuration**:

- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `Feature: cost-alert-system, Property {number}: {property_text}`

### Test Categories

#### 1. Parser Tests

**Unit Tests**:

- Parse valid CloudFormation template with known resources
- Parse valid guide markdown with known task sections
- Parse cost alert markdown with complete structure
- Handle empty files gracefully
- Handle malformed YAML/markdown with descriptive errors

**Property Tests**:

- **Property 1**: CloudFormation YAML round-trip
  - Generate random valid CloudFormation templates
  - Parse and serialize, verify equivalence
  - Tag: `Feature: cost-alert-system, Property 1: CloudFormation YAML Round-Trip`

- **Property 21**: Cost Alert round-trip
  - Generate random valid cost alerts
  - Parse, pretty-print, parse again, verify equivalence
  - Tag: `Feature: cost-alert-system, Property 21: Cost Alert Round-Trip`

#### 2. Resource Extraction Tests

**Unit Tests**:

- Extract EC2 instance from CloudFormation
- Extract RDS instance from guide markdown
- Extract Lambda function with correct specifications
- Handle resources without specifications

**Property Tests**:

- **Property 2**: Complete resource extraction from CloudFormation
  - Generate CloudFormation templates with varying numbers of resources
  - Verify all resources are extracted with complete information
  - Tag: `Feature: cost-alert-system, Property 2: Complete Resource Extraction from CloudFormation`

- **Property 4**: Complete manual resource extraction from guides
  - Generate guide markdown with varying task structures
  - Verify all manual resources are extracted
  - Tag: `Feature: cost-alert-system, Property 4: Complete Manual Resource Extraction from Guides`

#### 3. Pricing Tests

**Unit Tests**:

- Look up EC2 t3.micro pricing in ap-northeast-2
- Look up RDS db.t3.micro pricing in ap-northeast-2
- Look up Bedrock pricing in us-east-1
- Identify Lambda as free-tier resource
- Handle unknown resource types

**Property Tests**:

- **Property 6**: Pricing lookup accuracy
  - For all known service/specification pairs, verify correct pricing
  - Tag: `Feature: cost-alert-system, Property 6: Pricing Lookup Accuracy`

- **Property 7**: Free-tier resource identification
  - For all free-tier resources, verify "무료" marking
  - Tag: `Feature: cost-alert-system, Property 7: Free-Tier Resource Identification`

#### 4. Cost Calculation Tests

**Unit Tests**:

- Calculate total cost for 2 paid resources
- Calculate total cost excluding free resources
- Round total cost to 2 decimal places
- Calculate lab cost with duration multiplier

**Property Tests**:

- **Property 10**: Total cost calculation
  - Generate random sets of resources with costs
  - Verify total equals sum of non-free resources
  - Tag: `Feature: cost-alert-system, Property 10: Total Cost Calculation`

- **Property 19**: Cost calculation validation
  - Generate cost alerts with resource lists
  - Verify stated total matches calculated total
  - Tag: `Feature: cost-alert-system, Property 19: Cost Calculation Validation`

#### 5. Alert Generation Tests

**Unit Tests**:

- Generate alert for session with IaC only
- Generate alert for session with manual resources only
- Generate alert for session with mixed resources
- Generate alert with high-cost resource tips
- Generate alert with instance type warnings

**Property Tests**:

- **Property 8**: Cost alert markdown generation
  - Generate alerts from random resource sets
  - Verify output is valid markdown
  - Tag: `Feature: cost-alert-system, Property 8: Cost Alert Markdown Generation`

- **Property 11**: Complete alert structure
  - Generate alerts from random inputs
  - Verify all required sections are present
  - Tag: `Feature: cost-alert-system, Property 11: Complete Alert Structure`

- **Property 15**: Table column alignment
  - Generate alerts with varying resource counts
  - Verify table columns are properly aligned
  - Tag: `Feature: cost-alert-system, Property 15: Table Column Alignment`

#### 6. Batch Processing Tests

**Unit Tests**:

- Process single session successfully
- Process session with missing CloudFormation
- Process session with missing guide
- Process all 32 sessions (integration test)
- Generate summary report

**Property Tests**:

- **Property 16**: Batch processing completeness
  - Verify all 32 sessions are processed exactly once
  - Tag: `Feature: cost-alert-system, Property 16: Batch Processing Completeness`

- **Property 17**: Graceful handling of missing files
  - Generate random combinations of missing files
  - Verify system continues processing
  - Tag: `Feature: cost-alert-system, Property 17: Graceful Handling of Missing Files`

#### 7. Validation Tests

**Unit Tests**:

- Validate alert with all valid data
- Detect unknown resource type
- Detect invalid price format
- Detect cost calculation mismatch
- Detect missing required section

**Property Tests**:

- **Property 18**: Validation completeness
  - Generate random cost alerts
  - Verify all validation rules are checked
  - Tag: `Feature: cost-alert-system, Property 18: Validation Completeness`

#### 8. Region-Specific Tests

**Unit Tests**:

- Detect Bedrock session (14-1, 14-2, 14-3)
- Use us-east-1 pricing for Bedrock
- Use ap-northeast-2 pricing for standard services
- Update alert title with correct region

**Property Tests**:

- **Property 23**: Bedrock region detection
  - Verify Week 14 sessions use us-east-1
  - Tag: `Feature: cost-alert-system, Property 23: Bedrock Region Detection`

- **Property 24**: Region-specific pricing
  - For all sessions, verify pricing matches designated region
  - Tag: `Feature: cost-alert-system, Property 24: Region-Specific Pricing`

### Test Data

#### Sample CloudFormation Template

```yaml
Resources:
  WebServer:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: t3.micro
      ImageId: ami-0c76973fbe0ee100c

  Database:
    Type: AWS::RDS::DBInstance
    Properties:
      DBInstanceClass: db.t3.micro
      Engine: mysql
```

#### Sample Guide Markdown

```markdown
## 태스크 1: Amazon EC2 인스턴스 생성

1. EC2 콘솔로 이동합니다.
2. **Instance type**에서 `t3.micro`를 선택합니다.
3. [[Launch instance]] 버튼을 클릭합니다.
```

#### Sample Cost Alert (Standard Resources)

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (ap-northeast-2 기준, 온디맨드 요금 기준)**
>
> | 리소스명   | 타입/사양   | IaC |         비용 |
> | ---------- | ----------- | :-: | -----------: |
> | Amazon EC2 | t3.micro    | ✅  | $0.0126/시간 |
> | Amazon RDS | db.t3.micro | ✅  | $0.0170/시간 |
>
> - **예상 실습 시간**: 1-2시간
> - **예상 총 비용**: 약 $0.03-0.06/시간
```

#### Sample Cost Alert (Token-Based Pricing)

```markdown
> [!COST]
> **리소스 운영 비용 가이드 (us-east-1 기준, 온디맨드 요금 기준)**
>
> | 리소스명       | 타입/사양             | IaC |             비용 |
> | -------------- | --------------------- | :-: | ---------------: |
> | Amazon Bedrock | Claude 3 Haiku (입력) | ❌  | $0.00025/1K 토큰 |
> | Amazon Bedrock | Claude 3 Haiku (출력) | ❌  | $0.00125/1K 토큰 |
>
> - **예상 실습 시간**: 30분-1시간
> - **예상 총 비용**: 약 $0.50-1.00 (프롬프트 테스트 20-30회 기준)
>
> 💡 **실무 팁**: Amazon Bedrock은 사용한 토큰 수만큼만 비용이 발생합니다. 프롬프트를 간결하게 작성하고 불필요한 반복 테스트를 줄이면 비용을 절감할 수 있습니다.
```

### Coverage Goals

- **Line Coverage**: Minimum 80%
- **Branch Coverage**: Minimum 75%
- **Property Test Iterations**: Minimum 100 per test
- **Critical Path Coverage**: 100% (parsing, pricing, generation, validation)

### Continuous Integration

- Run all tests on every commit
- Run property tests with increased iterations (1000) on release branches
- Generate coverage reports
- Fail build if coverage drops below threshold
- Fail build if any property test fails

## Implementation Notes

### Technology Stack

**Recommended**: TypeScript with Node.js

- Strong typing for data models
- Excellent YAML/Markdown parsing libraries
- Fast-check for property-based testing
- Easy integration with existing project

**Alternative**: Python

- Excellent for text processing
- Hypothesis for property-based testing
- PyYAML for CloudFormation parsing
- Good for scripting and automation

### Key Algorithms

#### 1. Batch Processing Algorithm

```typescript
function processBatch(sessions: SessionInfo[]): BatchResult {
  const results: ProcessingResult[] = [];
  const errors: ProcessingError[] = [];
  const manualReview: SessionInfo[] = [];

  for (const session of sessions) {
    try {
      // Extract resources from CloudFormation
      const cfResources = extractCloudFormationResources(session);

      // Extract resources from guide
      const guideResources = extractGuideResources(session);

      // Combine resources
      const allResources = [...cfResources, ...guideResources];

      // Enrich with pricing
      const enrichedResources = enrichWithPricing(allResources, session.region);

      // Generate alert
      const alert = generateAlert(session, enrichedResources);

      // Validate
      const validation = validateAlert(alert);

      if (validation.warnings.length > 0) {
        manualReview.push(session);
      }

      // Output
      outputAlert(session, alert);

      results.push({ session, status: 'success', alert });
    } catch (error) {
      errors.push({ session, phase: 'unknown', error: error.message });
      results.push({ session, status: 'failed', error });
    }
  }

  return {
    totalProcessed: sessions.length,
    successful: results.filter((r) => r.status === 'success').length,
    failed: results.filter((r) => r.status === 'failed').length,
    manualReviewRequired: manualReview,
    errors: errors,
    summary: calculateSummary(results),
  };
}
```

#### 2. CloudFormation Resource Extraction

```typescript
function extractCloudFormationResources(session: SessionInfo): Resource[] {
  if (!session.hasCloudFormation) {
    return [];
  }

  const yaml = readYAMLFile(session.cloudFormationPath);
  const resources: Resource[] = [];

  for (const [logicalName, resource] of Object.entries(yaml.Resources)) {
    const type = resource.Type;
    const serviceName = mapTypeToServiceName(type);
    const specification = extractSpecification(resource.Properties, type);

    resources.push({
      name: serviceName,
      type: type,
      serviceName: serviceName,
      specification: specification,
      isIaC: true,
      source: 'cloudformation',
    });
  }

  return resources;
}

function extractSpecification(properties: any, type: string): string {
  // Map CloudFormation types to property names
  const specMap = {
    'AWS::EC2::Instance': 'InstanceType',
    'AWS::RDS::DBInstance': 'DBInstanceClass',
    'AWS::ElastiCache::CacheCluster': 'CacheNodeType',
    'AWS::Lambda::Function': 'Runtime',
    // ... more mappings
  };

  const propName = specMap[type];
  return propName ? properties[propName] : 'N/A';
}
```

#### 3. Guide Resource Extraction

```typescript
function extractGuideResources(session: SessionInfo): Resource[] {
  if (!session.hasGuide) {
    return [];
  }

  const markdown = readMarkdownFile(session.guidePath);
  const resources: Resource[] = [];

  // Parse markdown into sections
  const tasks = extractTaskSections(markdown);

  for (const task of tasks) {
    // Aggressive approach: Look for AWS service mentions
    // This may produce false positives, but manual review will catch them
    const servicePatterns = [
      /Amazon (EC2|RDS|S3|DynamoDB|ElastiCache|Bedrock|CloudFront)/g,
      /AWS (Lambda|IAM|CloudFormation|Glue|Config|X-Ray)/g,
      /NAT Gateway/g,
      /VPC Endpoint/g,
      /API Gateway/g,
      /EventBridge/g,
      /CodeBuild/g,
      /CodePipeline/g,
      /GuardDuty/g,
      /Secrets Manager/g,
    ];

    for (const pattern of servicePatterns) {
      const matches = task.content.matchAll(pattern);
      for (const match of matches) {
        const serviceName = match[0];
        const specification = extractSpecFromContext(task.content, serviceName);

        resources.push({
          name: serviceName,
          type: serviceName,
          serviceName: serviceName,
          specification: specification,
          isIaC: false,
          source: 'guide',
        });
      }
    }
  }

  // Deduplicate resources (same service + specification)
  return deduplicateResources(resources);
}

function deduplicateResources(resources: Resource[]): Resource[] {
  const seen = new Map<string, Resource>();

  for (const resource of resources) {
    const key = `${resource.serviceName}:${resource.specification}`;
    if (!seen.has(key)) {
      seen.set(key, resource);
    }
  }

  return Array.from(seen.values());
}

function extractSpecFromContext(text: string, serviceName: string): string {
  // Look for instance types, sizes, model names, etc. near the service name
  const specPatterns = [
    // EC2/RDS/ElastiCache instance types
    /t[2-4]\.(nano|micro|small|medium|large|xlarge|2xlarge)/,
    /db\.t[2-4]\.(micro|small|medium|large)/,
    /cache\.t[2-4]\.(micro|small|medium|large)/,

    // Bedrock models
    /Claude 3(\.5)? (Haiku|Sonnet|Opus)/,
    /Claude 3(\.5)? (Haiku|Sonnet|Opus) \((입력|출력)\)/,

    // Storage sizes
    /\d+GB/,
    /\d+TB/,

    // Lambda runtime
    /Python 3\.\d+/,
    /Node\.js \d+\.x/,
  ];

  // Search within 200 characters of service name (increased for better context)
  const context = extractContext(text, serviceName, 200);

  for (const pattern of specPatterns) {
    const match = context.match(pattern);
    if (match) {
      return match[0];
    }
  }

  // Special handling for Bedrock: if no spec found, check if it's input/output token pricing
  if (serviceName.includes('Bedrock')) {
    // Will be handled by pricing database to split into input/output rows
    return 'Claude 3 Haiku'; // Default model
  }

  return 'N/A';
}

function extractContext(
  text: string,
  searchTerm: string,
  radius: number,
): string {
  const index = text.indexOf(searchTerm);
  if (index === -1) return '';

  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + searchTerm.length + radius);

  return text.substring(start, end);
}
```

#### 4. Pricing Enrichment

```typescript
function enrichWithPricing(
  resources: Resource[],
  region: Region,
): EnrichedResource[] {
  return resources.map((resource) => {
    const priceInfo = pricingDatabase.getPrice(
      resource.serviceName,
      resource.specification,
      region,
    );

    return {
      ...resource,
      priceInfo: priceInfo,
      pricingUrl: pricingDatabase.getPricingUrl(resource.serviceName),
    };
  });
}
```

#### 5. Alert Generation

```typescript
function generateAlert(session: SessionInfo, resources: EnrichedResource[]): string {
  const title = `리소스 운영 비용 가이드 (${session.region} 기준, 온디맨드 요금 기준)`

  // Generate table
  const tableRows = resources.map(r => {
    const iacMarker = r.isIaC ? '✅' : '❌'
    const cost = r.priceInfo.isFreeT tier ? '무료' : `$${r.priceInfo.hourlyRate.toFixed(4)}`
    return `| ${r.serviceName} | ${r.specification} | ${iacMarker} | ${cost} |`
  })

  // Calculate total cost (hourly-billed resources only, including free tier resources at their on-demand price)
  const hourlyResources = resources.filter(r => r.priceInfo.pricingUnit === '시간')
  const totalCost = hourlyResources.reduce((sum, r) => sum + r.priceInfo.hourlyRate, 0)

  // Generate tips
  const tips = generateTips(resources)

  // Generate warnings
  const warnings = generateWarnings(resources)

  // Assemble alert
  return assembleAlert({
    title,
    tableRows,
    totalCost,
    tips,
    warnings,
    region: session.region
  })
}

function generateTips(resources: EnrichedResource[]): string[] {
  const tips: string[] = []

  // High-cost resource tips
  const highCostResources = ['NAT Gateway', 'Amazon RDS', 'Amazon ElastiCache', 'Amazon EKS']
  for (const resource of resources) {
    if (highCostResources.includes(resource.serviceName)) {
      tips.push(generateHighCostTip(resource))
    }
  }

  return tips
}

function generateHighCostTip(resource: EnrichedResource): string {
  const tipMap = {
    'NAT Gateway': '💡 **실무 팁**: NAT Gateway는 비용이 높은 리소스입니다. 프로덕션 환경에서는 VPC Endpoint를 우선 고려하세요.',
    'Amazon RDS': '💡 **실무 팁**: RDS는 시간당 비용이 발생합니다. 개발 환경에서는 사용하지 않을 때 중지하여 비용을 절감할 수 있습니다.',
    'Amazon ElastiCache': '💡 **실무 팁**: ElastiCache는 시간당 비용이 발생합니다. 실습 후 반드시 삭제하여 불필요한 비용을 방지하세요.',
    'Amazon EKS': '💡 **실무 팁**: Amazon EKS 클러스터는 시간당 $0.10의 고정 비용이 발생합니다. 실습 후 반드시 클러스터를 삭제하세요.'
  }

  return tipMap[resource.serviceName] || ''
}
```

#### 6. Cost Alert Parser

```typescript
function parseCostAlert(markdown: string): Result<CostAlert, ParseError> {
  try {
    // Extract title
    const titleMatch = markdown.match(
      /\*\*리소스 운영 비용 가이드 \((.+?) 기준/,
    );
    if (!titleMatch) {
      return Err({ message: 'Title not found', lineNumber: 1 });
    }
    const region = titleMatch[1] as Region;

    // Extract table
    const tableRegex =
      /\| 리소스명 \| 타입\/사양 \| IaC \| 시간당 비용 \|([\s\S]+?)(?=\n\n|\n-)/;
    const tableMatch = markdown.match(tableRegex);
    if (!tableMatch) {
      return Err({
        message: 'Resource table not found',
        lineNumber: findLineNumber(markdown, '리소스명'),
      });
    }

    const rows = parseTableRows(tableMatch[1]);

    // Extract metadata
    const durationMatch = markdown.match(/\*\*예상 실습 시간\*\*: (.+)/);
    const totalCostMatch = markdown.match(/\*\*예상 총 비용\*\*: 약 \$(.+)/);

    // Extract tips and warnings
    const tips = extractTips(markdown);
    const warnings = extractWarnings(markdown);

    return Ok({
      title: titleMatch[0],
      region: region,
      resources: rows,
      estimatedDuration: durationMatch?.[1] || '1-2시간',
      totalHourlyCost: calculateTotalFromRows(rows),
      estimatedTotalCost: totalCostMatch?.[1] || '0.00',
      freePlanNotice: extractFreePlanNotice(markdown),
      tips: tips,
      warnings: warnings,
      disclaimer: extractDisclaimer(markdown),
      pricingLinks: extractPricingLinks(markdown),
    });
  } catch (error) {
    return Err({ message: error.message, lineNumber: 0 });
  }
}

function parseTableRows(tableText: string): ResourceRow[] {
  const lines = tableText.trim().split('\n');
  return lines
    .filter((line) => line.includes('|') && !line.includes('---'))
    .map((line) => {
      const cells = line
        .split('|')
        .map((c) => c.trim())
        .filter((c) => c);
      return {
        name: cells[0],
        typeSpec: cells[1],
        isIaC: cells[2] === '✅',
        hourlyCost: cells[3],
      };
    });
}
```

#### 7. Pretty Printer

```typescript
function prettyPrintCostAlert(alert: CostAlert): string {
  const lines: string[] = [];

  // Alert header
  lines.push('> [!COST]');
  lines.push(`> **${alert.title}**`);
  lines.push('>');

  // Table header
  lines.push('> | 리소스명 | 타입/사양 | IaC | 비용 |');
  lines.push('> |---------|----------|:---:|----------:|');

  // Table rows
  for (const row of alert.resources) {
    const iacMarker = row.isIaC ? '✅' : '❌';
    lines.push(
      `> | ${row.name} | ${row.typeSpec} | ${iacMarker} | ${row.hourlyCost} |`,
    );
  }

  lines.push('>');

  // Cost summary
  lines.push(`> - **예상 실습 시간**: ${alert.estimatedDuration}`);
  lines.push(`> - **예상 총 비용**: 약 $${alert.estimatedTotalCost}`);
  lines.push('>');

  // Free plan notice
  if (alert.freePlanNotice) {
    lines.push('> **무료 플랜**');
    lines.push('>');
    lines.push(`> ${alert.freePlanNotice}`);
    lines.push('>');
  }

  // Tips
  if (alert.tips.length > 0) {
    lines.push('> **실무 팁**');
    lines.push('>');
    for (const tip of alert.tips) {
      lines.push(`> ${tip}`);
    }
    lines.push('>');
  }

  // Warnings
  if (alert.warnings.length > 0) {
    lines.push('> **참고**');
    lines.push('>');
    for (const warning of alert.warnings) {
      lines.push(`> ${warning}`);
    }
    lines.push('>');
  }

  // Disclaimer
  lines.push(`> ${alert.disclaimer}`);

  // Pricing links
  if (alert.pricingLinks.length > 0) {
    lines.push('>');
    lines.push('> **참고 링크**');
    for (const link of alert.pricingLinks) {
      lines.push(`> - ${link}`);
    }
  }

  return lines.join('\n');
}
```

### Performance Considerations

1. **File I/O**: Cache file contents to avoid repeated reads
2. **Parsing**: Use streaming parsers for large files
3. **Pricing Lookup**: Use hash map for O(1) lookup time
4. **Batch Processing**: Process sessions in parallel if needed (with proper error handling)
5. **Memory**: Process one session at a time to minimize memory usage

### Extensibility Points

1. **New AWS Services**: Add to pricing database and type mapping
2. **New Regions**: Add region-specific pricing data
3. **Custom Tips**: Extend tip generation rules
4. **Output Formats**: Add new output formatters (JSON, HTML, etc.)
5. **Pricing Sources**: Replace static database with API integration

### Security Considerations

1. **File Path Validation**: Validate all file paths to prevent directory traversal
2. **YAML Parsing**: Use safe YAML parser to prevent code injection
3. **Input Sanitization**: Sanitize all user inputs before processing
4. **Error Messages**: Don't expose sensitive file paths in error messages
