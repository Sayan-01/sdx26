import { NextResponse } from "next/server";
import { signIn } from "../../../../../auth";

export const POST = async (req:any) => {
  let { email, password } = await req.json();
  try {
    const user = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    
    return NextResponse.json({ message: "User login" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Email or password is incorrect" }, { status: 400 });
  }
};
