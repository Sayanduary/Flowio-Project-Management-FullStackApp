import { SignIn, SignUp } from "@clerk/react";
import { Link } from "react-router-dom";
import { ArrowLeft, Boxes } from "lucide-react";

export const SignInPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center items-center p-4 relative">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex items-center gap-2.5 mb-8">
        <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
          <Boxes className="size-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Flowio
        </span>
      </div>

      <SignIn fallbackRedirectUrl="/dashboard" routing="path" path="/sign-in" signUpUrl="/sign-up" />
    </div>
  );
};

export const SignUpPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 flex flex-col justify-center items-center p-4 relative">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="flex items-center gap-2.5 mb-8">
        <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
          <Boxes className="size-6" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Flowio
        </span>
      </div>

      <SignUp fallbackRedirectUrl="/dashboard" routing="path" path="/sign-up" signInUrl="/sign-in" />
    </div>
  );
};
