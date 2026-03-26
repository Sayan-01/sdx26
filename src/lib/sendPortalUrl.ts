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
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, message: "Email sending failed" };
  }
}; 

export const sendInviteEmaill = async (email: string, name: string, inviteLink: string) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Invitation Link",
    text: `Hay ${name}, you've been invited to your agency, your invitation Link is: ${inviteLink}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, message: "Email sending failed" };
  }
};