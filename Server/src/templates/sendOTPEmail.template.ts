// src/templates/email/otpEmailTemplate.ts

type OtpEmailTemplateProps = {
  otp: string;
  magicLink: string;
};

export const otpEmailTemplate = ({
  otp,
  magicLink,
}: OtpEmailTemplateProps) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  </head>
  <body style="margin:0;padding:0;background-color:#09090b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

    <table width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#09090b;padding:40px 20px;">
      <tr>
        <td align="center">

          <table width="100%" cellspacing="0" cellpadding="0" border="0"
            style="max-width:560px;background:#18181b;border:1px solid #27272a;border-radius:24px;overflow:hidden;">

            <tr>
              <td style="padding:48px 40px;text-align:center;">
                <h1 style="color:#fff;margin:0;">⚡ Varta</h1>
                <p style="color:#a1a1aa;">
                  Verify your email to continue securely
                </p>

                <div style="
                  margin:32px 0;
                  background:#0f0f12;
                  border-radius:20px;
                  padding:24px;
                  border:1px solid #27272a;
                ">
                  <p style="color:#71717a;font-size:12px;">
                    YOUR VERIFICATION CODE
                  </p>

                  <h2 style="
                    color:#a78bfa;
                    font-size:48px;
                    letter-spacing:10px;
                    margin:0;
                  ">
                    ${otp}
                  </h2>

                  <p style="color:#a1a1aa;">
                    Expires in 5 minutes
                  </p>
                </div>

                <a href="${magicLink}"
                  style="
                    display:inline-block;
                    background:#6366f1;
                    color:#fff;
                    text-decoration:none;
                    padding:16px 32px;
                    border-radius:12px;
                    font-weight:700;
                  ">
                  Verify My Email
                </a>

              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;
};