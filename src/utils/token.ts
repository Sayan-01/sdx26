export const generateVerificationToken = async () => {//=> (email)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); //1hr
  return { otp, expires };
};
