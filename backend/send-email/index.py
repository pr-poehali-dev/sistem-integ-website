import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import os
import base64

def handler(event: dict, context) -> dict:
    """
    Отправка заявок с формы обратной связи на email
    """
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

    try:
        body = json.loads(event.get('body', '{}'))
        name = body.get('name', '')
        email = body.get('email', '')
        phone = body.get('phone', '')
        company = body.get('company', '')
        message = body.get('message', '')
        systems = body.get('systems', [])
        file_data = body.get('file')

        if not name or not email or not message:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Заполните все обязательные поля'}),
                'isBase64Encoded': False
            }

        smtp_host = os.environ.get('SMTP_HOST', 'smtp.yandex.ru')
        smtp_port = int(os.environ.get('SMTP_PORT', '465'))
        smtp_user = os.environ.get('SMTP_USER')
        smtp_password = os.environ.get('SMTP_PASSWORD')
        recipient_email = os.environ.get('RECIPIENT_EMAIL', 'info@systemcraft.ru')

        if not smtp_user or not smtp_password:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Настройки почты не заданы. Обратитесь к администратору.'}),
                'isBase64Encoded': False
            }

        msg = MIMEMultipart()
        msg['From'] = smtp_user
        msg['To'] = recipient_email
        msg['Subject'] = f'Новая заявка с сайта от {name}'

        systems_labels = {
            'sks': 'СКС - Структурированные кабельные системы',
            'saps': 'САПС - Система автоматической пожарной сигнализации',
            'soue': 'СОУЭ - Система оповещения и управления эвакуацией',
            'skud': 'СКУД - Система контроля и управления доступом',
            'sots': 'СОТС - Система охранно-тревожной сигнализации',
            'sot': 'СОТ - Система охранного телевидения',
            'askue': 'АСКУЭ - Автоматизированная система коммерческого учета электроэнергии',
            'eom': 'ЭОМ - Электрооборудование и молниезащита',
            'ovik': 'ОВИК - Отопление, вентиляция и кондиционирование'
        }

        systems_text = ''
        if systems:
            systems_list = '<ul style="margin: 5px 0; padding-left: 20px;">'
            for sys_id in systems:
                systems_list += f'<li>{systems_labels.get(sys_id, sys_id)}</li>'
            systems_list += '</ul>'
            systems_text = f"""
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; vertical-align: top;"><strong>Интересующие системы:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{systems_list}</td>
                </tr>
            """

        company_text = ''
        if company:
            company_text = f"""
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Компания:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{company}</td>
                </tr>
            """

        email_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #ff6b35;">Новая заявка с сайта</h2>
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Имя:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{name}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:{email}">{email}</a></td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Телефон:</strong></td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee;">{phone if phone else 'Не указан'}</td>
                </tr>
                {company_text}
                {systems_text}
                <tr>
                    <td style="padding: 10px; vertical-align: top;"><strong>Сообщение:</strong></td>
                    <td style="padding: 10px;">{message}</td>
                </tr>
            </table>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
                Это письмо отправлено автоматически с формы обратной связи сайта.
            </p>
        </body>
        </html>
        """

        msg.attach(MIMEText(email_body, 'html'))

        if file_data:
            try:
                file_content = base64.b64decode(file_data['content'])
                file_name = file_data['name']
                file_type = file_data.get('type', 'application/octet-stream')

                attachment = MIMEBase('application', 'octet-stream')
                attachment.set_payload(file_content)
                encoders.encode_base64(attachment)
                attachment.add_header('Content-Disposition', f'attachment; filename="{file_name}"')
                msg.attach(attachment)
            except Exception as e:
                pass

        with smtplib.SMTP_SSL(smtp_host, smtp_port) as server:
            server.login(smtp_user, smtp_password)
            server.send_message(msg)

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'success': True, 'message': 'Заявка успешно отправлена'}),
            'isBase64Encoded': False
        }

    except json.JSONDecodeError:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Некорректный формат данных'}),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': f'Ошибка отправки: {str(e)}'}),
            'isBase64Encoded': False
        }