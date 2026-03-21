import { transporter } from "./sendOtpViaNodeMailer";


export const sendPortalUrl = async (email: string, name: string, portalUrl: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Project Portal Link",
    text: `Hay ${name}, you've been invited to your project portal, your project Portal Link is: ${portalUrl}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email error is" };
  } catch (error) {
    console.log("Email error is");
    return { success: false, message: "Email error is" };
  }
}; 