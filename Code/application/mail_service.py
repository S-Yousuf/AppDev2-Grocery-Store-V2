from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

SMTP_HOST = 'localhost'
SMTP_PORT = 1025
SENDER_EMAIL = 'yousuf@dummymail.com'
SENDER_PASSWORD = 'password'

def send_message(to, subject, content_body):
    msg = MIMEMultipart()
    msg['To'] = to
    msg['Subject'] = subject
    msg['From'] = SENDER_EMAIL
    msg.attach(MIMEText(content_body, 'plain'))
    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)
    client.send_message(mgs=msg)
    client.quit()

#send_message('abc@dummy.com', 'test', 'TEST')

