from __future__ import annotations
import asyncio
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from config import settings


def _send_sync(to_email: str, subject: str, html_body: str) -> None:
    if not settings.smtp_user or not settings.smtp_password:
        print(f"[EMAIL DISABLED - no SMTP configured] Would send to {to_email}: {subject}")
        return
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"{settings.smtp_from_name} <{settings.smtp_from_email or settings.smtp_user}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
        server.starttls()
        server.login(settings.smtp_user, settings.smtp_password.get_secret_value())
        server.sendmail(msg["From"], [to_email], msg.as_string())


async def send_email(to_email: str, subject: str, html_body: str) -> None:
    try:
        await asyncio.to_thread(_send_sync, to_email, subject, html_body)
    except Exception as e:
        print(f"[EMAIL ERROR] Failed to send to {to_email}: {e}")


async def send_activation_email(to_email: str, full_name: str, org_slug: str, otp: str) -> None:
    subject = "Set up your ThinkHive account"
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Welcome to ThinkHive, {full_name}!</h2>
      <p>Your account has been created. Use the code below to set your password and activate your account.</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background:#f4f4f4; padding: 16px; text-align:center; border-radius:8px;">{otp}</div>
      <p>This code expires in 30 minutes.</p>
      <p>Organization: <strong>{org_slug}</strong><br/>Email: <strong>{to_email}</strong></p>
      <p>Go to the ThinkHive activation page and enter your email, this code, and your new password.</p>
    </div>
    """
    await send_email(to_email, subject, html)


async def send_registration_otp_email(to_email: str, otp: str) -> None:
    subject = "Verify your email — ThinkHive"
    html = f"""
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2>Verify your email</h2>
      <p>Use the code below to verify your email and continue registering your company on ThinkHive.</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background:#f4f4f4; padding: 16px; text-align:center; border-radius:8px;">{otp}</div>
      <p>This code expires in 10 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
    </div>
    """
    await send_email(to_email, subject, html)