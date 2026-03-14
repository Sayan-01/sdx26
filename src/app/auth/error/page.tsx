import Button from "@/components/buttons/Button";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="font-bold md:text-[40px] text-[25px] text-center mx-5 mb-8 max-w-3xl">Some Thing Was Wrong or You Already Have a Account With This Email</h1>
      <Link href={`${process.env.NEXT_URL}/auth/login`}>
        <Button
          bigBlue
          className="py-3"
        >
          Log in
        </Button>
      </Link>
    </div>
  );
};

export default page;
