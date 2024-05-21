import os
from twilio.rest import Client

from dotenv import load_dotenv

load_dotenv()

auth_token = os.getenv("TWILIO_AUTH_TOKEN")
account_sid = os.getenv("TWILIO_ACCOUNT_SID")
verify_sid = os.getenv("TWILIO_VERIFY_SID")
verified_number = ""

client = Client(account_sid, auth_token)


def main():
    verification = client.verify.v2.services(verify_sid) \
        .verifications \
        .create(to=verified_number, channel="sms")
    print(verification.status)

    otp_code = input("Please enter the OTP:")

    verification_check = client.verify.v2.services(verify_sid) \
        .verification_checks \
        .create(to=verified_number, code=otp_code)
    print(verification_check.status)


if __name__ == "__main__":
    main()
