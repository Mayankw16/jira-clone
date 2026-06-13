"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { z } from "zod";

import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

import { registerSchema } from "../schemas";
import { useRegister } from "../api/use-register";

export const SignUpCard = () => {
  const { mutate } = useRegister();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    mutate({ json: values });
  };

  return (
    <Card className="w-full md:w-lg border-none shadow-none gap-4">
      <CardHeader className="flex flex-col items-center justify-center gap-y-3">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href="/sign-up">
            <span className="text-blue-700">Privacy Policy</span>
          </Link>{" "}
          and{" "}
          <Link href="/sign-up">
            <span className="text-blue-700">Terms of Service</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-6">
        <DottedSeparator />
      </div>
      <CardContent className="p-6">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    type="text"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    type="email"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter email address"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <Input
                    {...field}
                    type="password"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter your password"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <Button disabled={false} size="lg" className="w-full">
            Sign Up
          </Button>
        </form>
      </CardContent>
      <div className="px-6">
        <DottedSeparator />
      </div>
      <CardFooter className="flex flex-col gap-y-4 p-6">
        <Button
          onClick={() => signUpWithGoogle()}
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FcGoogle className="mr-2 size-5" />
          Signup with Google
        </Button>
        <Button
          onClick={() => signUpWithGithub()}
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Signup with Github
        </Button>
      </CardFooter>
      <div className="px-6">
        <DottedSeparator />
      </div>
      <CardFooter>
        <p className="w-full text-center">
          Already have an account?{" "}
          <Link href="/sign-in">
            <span className="text-blue-700">&nbsp;Sign In</span>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
