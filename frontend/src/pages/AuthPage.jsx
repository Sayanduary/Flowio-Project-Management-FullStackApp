import { SignIn, SignUp } from "@clerk/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  ArrowLeft,
  Boxes,
  Kanban,
  Users,
  BarChart3,
} from "lucide-react";
import clerkAppearance from "../configs/clerkAppearance";

const features = [
  {
    icon: Kanban,
    title: "Kanban Boards",
    desc: "Visual task management with drag-and-drop",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    desc: "Real-time workspace with your team",
  },
  {
    icon: BarChart3,
    title: "Sprint Analytics",
    desc: "Track velocity and ship on time",
  },
];

const LeftPanel = ({ isSignIn }) => (
  <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
    </div>

    <div className="relative z-10 flex flex-col justify-center px-12 lg:px-16 w-full">
      <div className="flex items-center gap-2.5 mb-14">
        <div className="size-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white shadow-md">
          <Boxes className="size-6" />
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">
          Flowio
        </span>
      </div>

      <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4">
        {isSignIn
          ? "Welcome back to Flowio"
          : "Start building with Flowio"}
      </h1>
      <p className="text-blue-100 text-lg mb-12 max-w-md leading-relaxed">
        {isSignIn
          ? "Sign in to access your workspaces, track projects, and collaborate with your team."
          : "Create your account and start managing projects with your team in minutes."}
      </p>

      <div className="space-y-6">
        {features.map((f) => (
          <div key={f.title} className="flex items-center gap-4">
            <div className="size-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
              <f.icon className="size-5 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">{f.title}</h4>
              <p className="text-xs text-blue-200 leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-14 pt-8 border-t border-white/10">
        <p className="text-sm text-blue-100 italic leading-relaxed">
          "Flowio cut our sprint planning overhead by half. The clean Kanban UI
          is a joy to use."
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div className="size-7 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold text-white">
            EW
          </div>
          <span className="text-xs text-blue-200">
            Elena Walsh, VP of Engineering
          </span>
        </div>
      </div>
    </div>
  </div>
);

const RightPanel = ({ isSignIn, isDark }) => (
  <div
    className={`flex-1 flex flex-col items-center justify-center p-6 sm:p-8 relative min-h-screen transition-colors ${
      isDark ? "bg-zinc-950" : "bg-white"
    }`}
  >
    <div className="absolute top-6 left-6">
      <Link
        to="/"
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          isDark
            ? "text-zinc-400 hover:text-white"
            : "text-slate-600 hover:text-blue-600"
        }`}
      >
        <ArrowLeft className="size-4" />
        <span>Back to Home</span>
      </Link>
    </div>

    <div className="flex items-center gap-2.5 mb-8 md:hidden">
      <div className="size-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md">
        <Boxes className="size-6" />
      </div>
      <span
        className={`text-2xl font-bold tracking-tight ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        Flowio
      </span>
    </div>

    <div className="w-full max-w-sm">
      {isSignIn ? (
        <SignIn
          appearance={clerkAppearance(isDark)}
          fallbackRedirectUrl="/dashboard"
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
        />
      ) : (
        <SignUp
          appearance={clerkAppearance(isDark)}
          fallbackRedirectUrl="/dashboard"
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
        />
      )}
    </div>
  </div>
);

export const SignInPage = () => {
  const { theme } = useSelector((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex">
      <LeftPanel isSignIn />
      <RightPanel isSignIn isDark={isDark} />
    </div>
  );
};

export const SignUpPage = () => {
  const { theme } = useSelector((state) => state.theme);
  const isDark = theme === "dark";

  return (
    <div className="min-h-screen flex">
      <LeftPanel isSignIn={false} />
      <RightPanel isSignIn={false} isDark={isDark} />
    </div>
  );
};
