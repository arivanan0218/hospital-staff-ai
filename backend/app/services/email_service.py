import smtplib
# WARNING: Hardcoding credentials is insecure. For testing only. Do not use in production.
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email(to_email: str, subject: str, body: str):
    smtp_host = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = 'arivuarivanan7@gmail.com'  # Hardcoded for testing only
    smtp_pass = 'vglu ohyy ndek rebs'       # Hardcoded for testing only

    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_host, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_email, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False 