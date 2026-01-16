import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для получения данных пользователя: проекты и юридические лица'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Email'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    user_email = event.get('headers', {}).get('X-User-Email') or event.get('queryStringParameters', {}).get('email')
    
    if not user_email:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'User email is required'})
        }
    
    try:
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        query = """
            SELECT 
                p.id as project_id,
                p.title,
                p.description,
                p.status,
                p.start_date,
                p.end_date,
                p.budget,
                up.role as user_role,
                le.id as legal_entity_id,
                le.name as legal_entity_name,
                le.inn,
                le.kpp,
                le.ogrn,
                le.legal_address,
                le.actual_address,
                le.director_name,
                le.phone as legal_entity_phone,
                le.email as legal_entity_email
            FROM user_projects up
            JOIN projects p ON up.project_id = p.id
            LEFT JOIN legal_entities le ON p.legal_entity_id = le.id
            WHERE up.user_email = %s
            ORDER BY p.created_at DESC
        """
        
        cursor.execute(query, (user_email,))
        rows = cursor.fetchall()
        
        projects = []
        for row in rows:
            projects.append({
                'project': {
                    'id': row['project_id'],
                    'title': row['title'],
                    'description': row['description'],
                    'status': row['status'],
                    'startDate': str(row['start_date']) if row['start_date'] else None,
                    'endDate': str(row['end_date']) if row['end_date'] else None,
                    'budget': float(row['budget']) if row['budget'] else None,
                    'userRole': row['user_role']
                },
                'legalEntity': {
                    'id': row['legal_entity_id'],
                    'name': row['legal_entity_name'],
                    'inn': row['inn'],
                    'kpp': row['kpp'],
                    'ogrn': row['ogrn'],
                    'legalAddress': row['legal_address'],
                    'actualAddress': row['actual_address'],
                    'directorName': row['director_name'],
                    'phone': row['legal_entity_phone'],
                    'email': row['legal_entity_email']
                } if row['legal_entity_id'] else None
            })
        
        cursor.close()
        conn.close()
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'userEmail': user_email,
                'projects': projects
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
