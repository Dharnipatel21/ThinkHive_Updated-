import smtplib
import asyncio
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from otp.service import generate_otp, verify_otp
from config import settings

router = APIRouter(prefix="/otp", tags=["otp"])

class SendReq(BaseModel):
    email: EmailStr

class VerifyReq(BaseModel):
    email: EmailStr; otp: str

def send_otp_email(to_email: str, otp: str) -> bool:
    if not settings.smtp_user or not settings.smtp_password:
        print("SMTP credentials not configured. Cannot send email.")
        return False
    try:
        msg = MIMEMultipart()
        from_name = settings.smtp_from_name or "ThinkHive"
        from_email = settings.smtp_from_email or settings.smtp_user
        msg["From"] = f"{from_name} <{from_email}>"
        msg["To"] = to_email
        msg["Subject"] = f"Your ThinkHive OTP: {otp}"

        body = f"""
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f7f6;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e1e8ed;">
              <h2 style="color: #1e3a8a; margin-top: 0; font-size: 24px;">Welcome to ThinkHive</h2>
              <hr style="border: 0; border-top: 1px solid #e1e8ed; margin: 20px 0;">
              <p style="font-size: 16px; color: #4a5568; line-height: 1.5;">Your One-Time Password (OTP) for authentication is:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #1e3a8a; margin: 30px 0; text-align: center; background-color: #f0f4f8; padding: 15px; border-radius: 6px; border: 1px dashed #cbd5e1;">
                {otp}
              </div>
              <p style="font-size: 14px; color: #718096; line-height: 1.5;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
              <hr style="border: 0; border-top: 1px solid #e1e8ed; margin: 20px 0;">
              <p style="font-size: 12px; color: #a0aec0; text-align: center; margin-bottom: 0;">This is an automated message from ThinkHive. Please do not reply directly to this email.</p>
            </div>
          </body>
        </html>
        """
        msg.attach(MIMEText(body, "html"))

        server = smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=10)
        server.starttls()
        server.login(settings.smtp_user, settings.smtp_password)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send SMTP email to {to_email}: {e}")
        return False

@router.post("/send")
async def send(req: SendReq) -> dict:
    otp = generate_otp(req.email)
    print(f"[DEV OTP] {req.email}: {otp}")
    
    # Send via SMTP asynchronously using executor to avoid blocking FastAPI
    sent = await asyncio.get_event_loop().run_in_executor(None, lambda: send_otp_email(req.email, otp))
    
    res = {"message": "OTP sent", "expires_in_minutes": 10}
    if settings.environment == "development":
        res["dev_otp"] = otp
        res["smtp_sent"] = sent
    return res

@router.post("/verify")
async def verify(req: VerifyReq) -> dict:
    if not verify_otp(req.email, req.otp):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid or expired OTP")
    return {"verified": True}

