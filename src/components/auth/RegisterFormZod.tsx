"use client";
import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { registerSchema } from "../../../validators/auth-validator";
import { Field, FieldError, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import Socials from "./Socials";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { generateVerificationToken } from "@/utils/token";
import { IsUserEmailExist, sendCodeThroughNodemailer } from "@/lib/queries";
import { Button } from "../ui/button";
import { ArrowRight, Layers, Loader2 } from "lucide-react";

const RegisterForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [preEmail, setPreEmail] = useState("");
  const [preOtp, setPreOtp] = useState("");
  const [expires, setExpires] = useState<Date | null>();
  const [code, setCode] = useState(false);

  const [step, setStep] = useState(1); // 1: User details, 2: Agency details

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      otp: "",
    },
  });

  const getCode = async () => {
    setCode(true);
    const email = form.getValues("email"); // Get the email value
    const username = form.getValues("username"); // Get the username value
    const checkUserEmailExist = await IsUserEmailExist(email);
    if (checkUserEmailExist) {
      setCode(false);
      return setError("Email already exist");
    }
    if (!email) {
      setError("Please enter your email first.");
      setCode(false);
      return;
    }
    setPreEmail(email);
    setError("");
    const { otp, expires } = await generateVerificationToken();
    //send verification email
    const emailRes = await sendCodeThroughNodemailer(email, username, otp);
    if (emailRes.status != 200) {
      setCode(false);
      return setError("Something was wrong via send email");
    }
    setPreOtp(otp);
    setExpires(expires);
  };

  const onSubmit = async (values: { username: string; email: string; password: string; otp: string }) => {
    setLoading(true); // Set loading to true
    const { username, email, password, otp } = values;

    if (!username || !email || !password || !otp) return setError("Filled all details");
    if (email !== preEmail) return setError("Email does not match");
    if (otp !== preOtp) return setError("OTP does not match");
    else {
      try {
        let res = await fetch("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({ ...values, expires }),
        });
        let data = await res.json();
        if (res.ok) {
          setSuccess(data.message);
          setLoading(false);

          const { signIn } = await import("next-auth/react");
          await signIn("credentials", {
            email,
            password,
            redirect: false,
          });

          // 3. Redirect to create-agency
          router.push("/create-agency");
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.log("Error in sign up", error);
      } finally {
        setLoading(false)
      }
    }
  };

  return (
    <div className="z-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <Link
          href="/"
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-zinc-950"
        >
          <Layers className="h-7 w-7" />
        </Link>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{step === 1 ? "Create your account" : "Setup your agency"}</h1>
          <p className="text-zinc-400">{step === 1 ? "Join Milestack now to streamline your client collaboration in one place." : "Tell us a bit about your agency to get started."}</p>
        </div>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 mt-4"
        noValidate
      >
        <FieldGroup>
          <Field>
            <Input
              className="rounded-lg h-[42px] border-zinc-800 border placeholder:opacity-40"
              placeholder="Your name"
              {...form.register("username")}
            />
            <FieldError errors={[form.formState.errors.username]} />
          </Field>

          <Field>
            <Input
              className="rounded-lg h-[42px] border-zinc-800 border placeholder:opacity-40"
              placeholder="youremail@gmail.com"
              {...form.register("email")}
            />
            <FieldError errors={[form.formState.errors.email]} />
          </Field>

          <Field>
            <Input
              className="rounded-lg h-[42px] border-zinc-800 border placeholder:opacity-40"
              type="password"
              placeholder="Password"
              {...form.register("password")}
            />
            <FieldError errors={[form.formState.errors.password]} />
          </Field>
        </FieldGroup>
        <div className="flex items-start gap-4">
          <Field className="flex-1">
            <Input
              className="rounded-lg h-[42px] border-zinc-800 border tracking-[6px] overflow-hidden! placeholder:opacity-40"
              type="text"
              maxLength={6}
              placeholder="OTP"
              {...form.register("otp")}
            />
            <FieldError errors={[form.formState.errors.otp]} />
          </Field>
          <div
            onClick={code ? undefined : getCode}
            className={` cursor-pointer h-[42px] border border-zinc-800 text-white/60 rounded-lg text-sm inline-flex items-center justify-center whitespace-nowrap px-2 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-zinc-900 ${
              code ? "opacity-30 hover:bg-zinc-800!" : "border-zinc-800 "
            }`}
          >
            Send code
          </div>
        </div>
        <div className="flex gap-2 items-start w-full">
          <RadioGroup
            defaultValue="comfortable"
            className="w-min"
          >
            <div className="flex items-center space-x-2 mt-[5px] ">
              <RadioGroupItem
                className=" rounded-sm border-zinc-800 border"
                value="default"
                id="r1"
              />
            </div>
          </RadioGroup>

          <div className="text-sm text-neutral-500 flex-1">
            I confirm that I have read and agree to the Azeorex's{" "}
            <a
              href="https://cdn.deepseek.com/policies/en-US/deepseek-terms-of-use.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Terms of Use
            </a>{" "}
            &{" "}
            <a
              href="https://cdn.deepseek.com/policies/en-US/deepseek-privacy-policy.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              Privacy Policy
            </a>
            .
          </div>
        </div>
        <div className={`mb-4 ${error ? "text-red-500 text-[0.8rem] font-medium" : " text-emerald-500 text-[0.8rem] font-medium"} `}>{error ? error : success}</div>
        <Button
          type="submit"
          className="w-full h-12 bg-white text-zinc-950 hover:bg-zinc-200 mt-2"
          disabled={loading}
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
          {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
        <h4 className="text-blue-100/80 mt-4 text-center text-sm">
          Already have an account?{" "}
          <span className=" text-blue-600">
            <Link href={`/auth/login`}>Login</Link>
          </span>
        </h4>
      </form>
      
      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-6 h-[1.5px] w-full" />
      <Socials />
    </div>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

export default RegisterForm;
