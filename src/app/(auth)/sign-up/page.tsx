import { redirect } from "next/navigation";

import { getUser } from "@/features/auth/queries";
import { SignUpCard } from "@/features/auth/components/sign-up-card";

const SignUpPage = async () => {
  const user = await getUser();

  if (user) redirect("/");

  return <SignUpCard />;
};

export default SignUpPage;
