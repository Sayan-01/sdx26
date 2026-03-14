// "use client";
// import React, { useState } from "react";
// import Wrapper from "@/components/design/Wrapper";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { SubmitButton } from "@/components/buttons/SubmitBtn";
// import { verifiedTokenSchema } from "../../../../../validators/auth-validator.ts";
// import Image from "next/image";
// import { useRouter } from "next/navigation";

// const page = ({ params }) => {
//   const [loading, setLoading] = useState(false); // Loading state
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const { username } = params;

//   const router = useRouter();
//   const form = useForm({
//     resolver: zodResolver(verifiedTokenSchema),
//     defaultValues: {
//       pin: "",
//     },
//   });

//   const onSubmit = async (data) => {
//     setLoading(true); // Set loading to true
//     const otp = await data.pin;

//     try {
//       const res = await fetch("/api/verify-code", {
//         method: "POST",
//         body: JSON.stringify({ username, otp }),
//         cache: "no-store",
//       });
//       let data = await res.json();
//       setLoading(false); // Set loading to false
//       if (res.ok) {
//         setSuccess(data.message);
//         router.push(`/auth/login`);
//       } else if (!res.ok) {
//         setError(data.message);
//       }
//     } catch (error) {
//       console.log("Error in sign up", error);
//       setLoading(false); // Set loading to false
//     }
//   };

//   return (
//     <Wrapper className="flex items-center justify-center w-full min-h-screen relative">
//       <Image
//         src={"/sign_bg.svg"}
//         width={500}
//         height={100}
//         className="absolute w-full h-[50rem] z-0"
//         alt="sing_bg"
//       />
//       <Card className="z-10 relative bg-black/60">
//         <CardHeader className=" text-center border-b mb-4">
//           <CardTitle className="font-extrabold md:text-5xl text-2xl mb-4 tracking-wide md:mx-5">Verify Your Account</CardTitle>
//           <CardDescription className="mb-6">Enter the verification code sent to you email.</CardDescription>
//         </CardHeader>
//         <CardContent className=" w-full">
//           <Form {...form}>
//             <form
//               onSubmit={form.handleSubmit(onSubmit)}
//               className=""
//             >
//               <FormField
//                 control={form.control}
//                 name="pin"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel
//                       className="mb-4
//                     "
//                     >
//                       One-Time Password
//                     </FormLabel>
//                     <FormControl>
//                       <InputOTP
//                         maxLength={6}
//                         {...field}
//                       >
//                         <InputOTPGroup>
//                           <InputOTPSlot index={0} />
//                           <InputOTPSlot index={1} />
//                           <InputOTPSlot index={2} />
//                         </InputOTPGroup>
//                         <InputOTPSeparator />
//                         <InputOTPGroup>
//                           <InputOTPSlot index={3} />
//                           <InputOTPSlot index={4} />
//                           <InputOTPSlot index={5} />
//                         </InputOTPGroup>
//                       </InputOTP>
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <div className={`mb-10 mt-1 ${error ? "text-red-500 text-[0.8rem] font-medium " : " text-emerald-500 text-[0.8rem] font-medium"} `}>{error ? error : success}</div>
//               <SubmitButton
//                 disable_className={"w-full rounded-md"}
//                 className="w-full rounded-md"
//                 type="submit"
//                 loading={loading}
//               >
//                 Submit
//               </SubmitButton>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </Wrapper>
//   );
// };

// export default page;

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
