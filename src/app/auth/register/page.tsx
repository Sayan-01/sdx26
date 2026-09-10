import RegisterForm from "@/components/auth/RegisterFormZod";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";

const page = async () => {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return <RegisterForm />;
};

export default page;
