import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";

export const POST = async (req: Request) => {
  // `await connectDb();
  // const { username, email, password } = await req.json();
  // const { otp, expires } = await generateVerificationToken();
  // if (!username || !email || !password) return NextResponse.json({ message: "Filled all details" }, { status: 500 });
  // const existingUserVerifiedByUsername = await db.user.findFirst({ where: { name: username } });
  // //=> User ache and se verified ooo
  // if (existingUserVerifiedByUsername) {
  //   return NextResponse.json({ success: false, message: "Username taken" }, { status: 400 });
  // }
  // const existingUserByEmail = await db.user.findFirst({ where: { email }, select: { id: true, email: true, password: true } });
  // //=> User exist kore
  // // if (existingUserByEmail) {
  // //   //=> User ache and se verified ooo
  // //   if (existingUserByEmail.isVarified) return NextResponse.json({ success: false, message: "User email already exist" }, { status: 400 });
  // //   //=> User ache and se verified noy
  // //   else {
  // //     // await User.findOneAndDelete({email})
  // //     let hashPass = await bcrypt.hash(password, 10);
  // //     existingUserByEmail.username = username;
  // //     existingUserByEmail.password = hashPass;
  // //     existingUserByEmail.varifiedToken = otp;
  // //     existingUserByEmail.varifiedTokenExpire = new Date(Date.now() + 3600000);
  // //     await existingUserByEmail.save();
  // //   }
  // // }
  // // //=> User exist e kore na orthat take save korate hobe
  // // else {
  // let hashPass = await bcrypt.hash(password, 10);
  // const newUser = await db.user.create({
  //   data: {
  //     name: username,
  //     email,
  //     password: hashPass, // Assuming password hashing is done before this step
  //     varifiedToken: otp, // Ensure field names match Prisma schema
  //     varifiedTokenExpire: expires,
  //     isVarified: true,
  //   },
  // });
  // // }
  // //send verification email
  // const emailRes = await verificationEmailSend({ email, username, varifiedToken: otp });
  // //after console.log(emailRes) we know this give a .status
  // if (emailRes.status != 200) return NextResponse.json({ message: "Something was wrong via send email" }, { status: 500 });
  // return NextResponse.json({ message: "Verification email send" }, { status: 200 });`

  const { username, email, password, otp, expires } = await req.json();
  let hashPass = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: {
      name: username,
      email,
      password: hashPass, // Assuming password hashing is done before this step
      varifiedToken: otp, // Ensure field names match Prisma schema
      varifiedTokenExpire: expires,
      role: "OWNER",
    },
  });
  if (newUser) {
    return NextResponse.json({ message: "User created successfully" }, { status: 200 });
  } else {
    return NextResponse.json({ message: "User creation failed" }, { status: 500 });
  }
};
