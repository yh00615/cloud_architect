"""
AWS Lambda 함수: Secrets Manager 및 Parameter Store 통합 데모

이 Lambda 함수는 AWS Secrets Manager와 Systems Manager Parameter Store를
사용하여 민감한 정보를 안전하게 관리하는 방법을 보여줍니다.

주요 기능:
    1. Secrets Manager에서 데이터베이스 자격증명 조회
    2. Secrets Manager에서 API 키 조회
    3. Parameter Store에서 일반 파라미터 조회
    4. Parameter Store에서 암호화된 파라미터 조회
    5. Parameter Store에서 경로별 파라미터 일괄 조회

환경 변수:
    없음

트리거:
    수동 호출 또는 EventBridge 스케줄

작성자: AWS 실습 가이드
버전: 1.0.0
"""

import json
import logging
import boto3
from botocore.exceptions import ClientError
from typing import Dict, Any

# 로깅 설정
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# AWS 클라이언트 초기화
secrets_client = boto3.client('secretsmanager')  # Secrets Manager 클라이언트
ssm_client = boto3.client('ssm')  # Systems Manager 클라이언트

def get_secret(secret_name: str) -> dict:
    """
    Secrets Manager에서 시크릿 조회
    
    JSON 형식으로 저장된 시크릿을 조회하고 파싱합니다.
    
    Args:
        secret_name (str): 시크릿 이름 또는 ARN
    
    Returns:
        dict: 파싱된 시크릿 값 (JSON)
    
    Raises:
        ClientError: 시크릿 조회 실패 시
    
    Example:
        >>> get_secret('prod/db/mysql/credentials')
        {'username': 'admin', 'password': 'secret123'}
    """
    try:
        # Secrets Manager에서 시크릿 값 조회
        response = secrets_client.get_secret_value(SecretId=secret_name)
        # JSON 문자열을 딕셔너리로 파싱
        return json.loads(response['SecretString'])
    except ClientError as e:
        # 오류 로깅 및 예외 재발생
        logger.error(f"Error retrieving secret: {e}")
        raise e

def get_parameter(parameter_name: str, with_decryption: bool = True) -> str:
    """
    Parameter Store에서 파라미터 조회
    
    단일 파라미터를 조회하며, 암호화된 파라미터는 자동으로 복호화합니다.
    
    Args:
        parameter_name (str): 파라미터 이름 (경로 포함)
        with_decryption (bool): 암호화된 파라미터 복호화 여부 (기본값: True)
    
    Returns:
        str: 파라미터 값
    
    Raises:
        ClientError: 파라미터 조회 실패 시
    
    Example:
        >>> get_parameter('/prod/app/config/region', with_decryption=False)
        'ap-northeast-2'
    """
    try:
        # Parameter Store에서 파라미터 조회
        response = ssm_client.get_parameter(
            Name=parameter_name,
            WithDecryption=with_decryption  # 암호화된 파라미터 복호화
        )
        # 파라미터 값 반환
        return response['Parameter']['Value']
    except ClientError as e:
        # 오류 로깅 및 예외 재발생
        logger.error(f"Error retrieving parameter: {e}")
        raise e

def get_parameters_by_path(path: str, with_decryption: bool = True) -> Dict[str, str]:
    """
    경로로 여러 파라미터 일괄 조회
    
    특정 경로 아래의 모든 파라미터를 재귀적으로 조회합니다.
    
    Args:
        path (str): 파라미터 경로 (예: /prod/app/config)
        with_decryption (bool): 암호화된 파라미터 복호화 여부 (기본값: True)
    
    Returns:
        dict: 파라미터 이름을 키로, 값을 값으로 하는 딕셔너리
    
    Raises:
        ClientError: 파라미터 조회 실패 시
    
    Example:
        >>> get_parameters_by_path('/prod/app/config')
        {
            '/prod/app/config/region': 'ap-northeast-2',
            '/prod/app/config/db-connection-string': 'mysql://...'
        }
    """
    try:
        # Parameter Store에서 경로별 파라미터 조회
        response = ssm_client.get_parameters_by_path(
            Path=path,
            Recursive=True,  # 하위 경로 포함
            WithDecryption=with_decryption  # 암호화된 파라미터 복호화
        )
        # 파라미터 목록을 딕셔너리로 변환
        return {p['Name']: p['Value'] for p in response['Parameters']}
    except ClientError as e:
        # 오류 로깅 및 예외 재발생
        logger.error(f"Error retrieving parameters: {e}")
        raise e

def lambda_handler(event: dict, context: Any) -> dict:
    """
    Secrets Manager 및 Parameter Store 통합 데모 Lambda 핸들러
    
    다양한 방법으로 시크릿과 파라미터를 조회하는 예제를 보여줍니다.
    
    Args:
        event (dict): Lambda 이벤트 (사용하지 않음)
        context (LambdaContext): Lambda 실행 컨텍스트
    
    Returns:
        dict: HTTP 응답 형식
            - statusCode (int): 200 (성공) 또는 500 (실패)
            - body (str): JSON 형식의 응답
    
    Example:
        >>> lambda_handler({}, None)
        {
            'statusCode': 200,
            'body': '{"message": "Successfully retrieved all secrets and parameters", ...}'
        }
    """
    try:
        # 1. 데이터베이스 자격증명 조회 (Secrets Manager)
        # JSON 형식으로 저장된 시크릿 조회
        db_credentials = get_secret('prod/db/mysql/credentials')
        logger.info(f"DB Username: {db_credentials.get('username')}")
        
        # 2. API 키 조회 (Secrets Manager)
        # 외부 서비스 API 키 조회
        api_credentials = get_secret('prod/api/external-service')
        # 보안을 위해 API 키 일부만 로깅
        logger.info(f"API Key retrieved: {api_credentials.get('api_key')[:10]}...")
        
        # 3. 개별 파라미터 조회 (Parameter Store - 일반)
        # 암호화되지 않은 파라미터 조회
        region = get_parameter('/prod/app/config/region', with_decryption=False)
        logger.info(f"Region: {region}")
        
        # 4. 암호화된 파라미터 조회 (Parameter Store - SecureString)
        # KMS로 암호화된 파라미터 조회 및 자동 복호화
        db_connection = get_parameter('/prod/app/config/db-connection-string')
        # 보안을 위해 연결 문자열 일부만 로깅
        logger.info(f"DB Connection: {db_connection[:20]}...")
        
        # 5. 경로로 모든 설정 조회 (Parameter Store - 일괄 조회)
        # 특정 경로 아래의 모든 파라미터 조회
        all_configs = get_parameters_by_path('/prod/app/config')
        logger.info(f"All configs: {list(all_configs.keys())}")
        
        # 성공 응답 반환
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Successfully retrieved all secrets and parameters',
                'region': region,
                'config_count': len(all_configs)
            })
        }
        
    except Exception as e:
        # 예외 발생 시 오류 응답 반환
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
