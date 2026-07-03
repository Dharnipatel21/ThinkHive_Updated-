import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Brain, Lock } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";

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
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F1A] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F8EF7]"><Brain size={24} className="text-white" /></div>
          <h1 className="text-2xl font-bold text-white">Think<span className="text-[#4F8EF7]">Hive</span></h1>
          <p className="mt-1 text-white/50">Sign in to your workspace</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-[#1C2540] bg-[#131929] p-8">
          {[
            { name: "organization_slug", label: "Organisation Slug", placeholder: "my-company", type: "text" },
            { name: "email", label: "Email", placeholder: "you@company.com", type: "email" },
            { name: "password", label: "Password", placeholder: "••••••••", type: "password" },
          ].map(({ name, label, placeholder, type }) => (
            <div key={name}>
              <label className="mb-1 block text-sm text-white/70">{label}</label>
              <input {...register(name)} type={type} placeholder={placeholder}
                className="w-full rounded-lg border border-[#1C2540] bg-[#0B0F1A] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#4F8EF7] focus:outline-none" />
              {errors[name] && <p className="mt-1 text-xs text-red-400">{errors[name].message}</p>}
            </div>
          ))}
          <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-[#4F8EF7] py-3 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 disabled:opacity-50">
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-sm text-white/50">No account? <Link to="/register" className="text-[#4F8EF7] hover:underline">Register your company</Link></p>
        </form>
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-white/30"><Lock size={12} /> All sessions are audit-logged</p>
      </div>
    </div>
  );
}
