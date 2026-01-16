import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def handler(event: dict, context) -> dict:
    '''API для отправки приглашения пользователю с логином и паролем'''
    
    method = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    body = {}
    user_email = None
    user_name = None
    user_password = None
    user_role = 'client'
    login_url = 'https://systemcraft.ru/login'
    
    try:
        body_str = event.get('body', '{}')
        
        if body_str:
            if isinstance(body_str, dict):
                body = body_str
            elif isinstance(body_str, str):
                try:
                    body = json.loads(body_str)
                except json.JSONDecodeError:
                    body = {}
        
        if isinstance(body, dict):
            user_email = body.get('email')
            user_name = body.get('name')
            user_password = body.get('password')
            user_role = body.get('role', 'client')
            login_url = body.get('loginUrl', 'https://systemcraft.ru/login')
        
        if not user_email or not user_name or not user_password:
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Email, name and password are required'})
            }
        
        smtp_host = os.environ.get('SMTP_HOST', 'smtp.gmail.com')
        smtp_port = int(os.environ.get('SMTP_PORT', '587'))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        from_email = os.environ.get('FROM_EMAIL', smtp_user)
        
        if not smtp_user or not smtp_password:
            return {
                'statusCode': 500,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'SMTP credentials not configured'})
            }
        
        role_names = {
            'admin': 'Администратор',
            'editor': 'Редактор',
            'client': 'Клиент',
            'employee': 'Сотрудник'
        }
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
                .credentials {{ background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }}
                .button {{ display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin-top: 20px; }}
                .footer {{ text-align: center; margin-top: 20px; color: #666; font-size: 12px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Добро пожаловать в СистемКрафт!</h1>
                </div>
                <div class="content">
                    <p>Здравствуйте, {user_name}!</p>
                    <p>Для вас создан аккаунт в системе СистемКрафт с ролью <strong>{role_names.get(user_role, user_role)}</strong>.</p>
                    
                    <div class="credentials">
                        <h3 style="margin-top: 0;">Данные для входа:</h3>
                        <p><strong>Логин (Email):</strong> {user_email}</p>
                        <p><strong>Пароль:</strong> {user_password}</p>
                        <p><strong>Ссылка для входа:</strong> <a href="{login_url}">{login_url}</a></p>
                    </div>
                    
                    <p>Рекомендуем изменить пароль после первого входа в систему.</p>
                    
                    <a href="{login_url}" class="button">Войти в систему</a>
                    
                    <div class="footer">
                        <p>Если у вас возникли вопросы, свяжитесь с администратором.</p>
                        <p>© 2024 СистемКрафт. Все права защищены.</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Приглашение в систему СистемКрафт - {role_names.get(user_role, user_role)}'
        msg['From'] = from_email
        msg['To'] = user_email
        
        html_part = MIMEText(html_content, 'html')
        msg.attach(html_part)
        
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({
                'success': True,
                'message': f'Invitation sent to {user_email}'
            })
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }