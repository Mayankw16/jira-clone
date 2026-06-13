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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DottedSeparator } from "@/components/dotted-seperator";
import { Button } from "@/components/ui/button";

import { loginSchema } from "../schemas";
import { useLogin } from "../api/use-login";
import { signUpWithGithub, signUpWithGoogle } from "@/lib/oauth";

export const SignInCard = () => {
  const { mutate } = useLogin();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    mutate({ json: values });
  };

  return (
    <Card className="w-full md:w-lg border-none shadow-none gap-4">
      <CardHeader className="flex items-center justify-center text-center">
        <CardTitle className="text-2xl">Welcome back!</CardTitle>
      </CardHeader>
      <div className="px-6">
        <DottedSeparator />
      </div>
      <CardContent className="p-6">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
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
            Login
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
          Login with Google
        </Button>
        <Button
          onClick={() => signUpWithGithub()}
          disabled={false}
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <FaGithub className="mr-2 size-5" />
          Login with Github
        </Button>
      </CardFooter>
      <div className="px-6">
        <DottedSeparator />
      </div>
      <CardFooter>
        <p className="w-full text-center">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up">
            <span className="text-blue-700">&nbsp;Sign Up</span>
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
