import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Brain, Lock, ArrowLeft, Check } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import ThemeToggle from "../Layout/ThemeToggle";

const schema = z.object({ email: z.string().email(), password: z.string().min(8), organization_slug: z.string().min(2) });

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(d) {
    try { await login(d.email, d.password, d.organization_slug); navigate("/dashboard"); }
    catch { toast.error("Login failed — check credentials and organisation slug"); }
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* left: form */}
      <div className="flex w-full flex-col justify-center px-8 py-12 lg:w-1/2 lg:px-20">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft size={15} /> Back
          </Link>
          <ThemeToggle />
        </div>

        <div className="mb-8">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary">
            <Brain size={20} className="text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl text-foreground">Think<span className="text-primary">Hive</span></h1>
          <h2 className="mt-4 font-display text-3xl text-foreground">Welcome back</h2>
          <p className="mt-1 text-muted-foreground">Sign in to your ThinkHive account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md space-y-4">
          {[
            { name: "organization_slug", label: "Organisation Slug", placeholder: "acme-corp", hint: "e.g. acme-corp", type: "text" },
            { name: "email", label: "Email address", placeholder: "you@company.com", type: "email" },
            { name: "password", label: "Password", placeholder: "••••••••", type: "password" },
          ].map(({ name, label, placeholder, type, hint }) => (
            <div key={name}>
              <input
                {...register(name)}
                type={type}
                placeholder={label === "Organisation Slug" ? "Organisation slug" : label === "Email address" ? "Email address" : "Password"}
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
              {hint && <p className="mt-1 text-xs text-muted-foreground/70">{hint}</p>}
              {errors[name] && <p className="mt-1 text-xs text-destructive">{errors[name].message}</p>}
            </div>
          ))}

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <input type="checkbox" className="rounded border-border" /> Remember me
            </label>
            <a href="#" className="text-primary hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            No account? <Link to="/register" className="text-primary hover:underline">Register your company</Link>
          </p>
        </form>

        <p className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground/70">
          <Lock size={12} /> All sessions are audit-logged
        </p>
      </div>

      {/* right: marketing panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-secondary/30 px-16">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-card">
            <Brain size={28} className="text-primary" />
          </div>
          <h2 className="font-display text-2xl text-foreground">Secure by design</h2>
          <p className="mt-3 text-muted-foreground">
            Role-based access control, end-to-end audit trails, and enterprise-grade security built into every layer of ThinkHive.
          </p>
          <div className="mt-6 space-y-2 text-left">
            {["SOC 2 Type II Certified", "GDPR Compliant", "99.9% SLA Uptime"].map(t => (
              <div key={t} className="flex items-center gap-2 rounded-xl bg-card px-4 py-3 text-sm text-foreground/80">
                <Check size={14} className="text-primary flex-shrink-0" /> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}