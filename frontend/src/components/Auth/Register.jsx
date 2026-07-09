import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Brain, CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { register as apiRegister, sendOTP, verifyOTP } from "../../services/api";
import { storeLoginToken } from "../../services/auth";
import { useAuthStore } from "../../store/useAuthStore";
import ThemeToggle from "../Layout/ThemeToggle";

const STEPS = ["Company Info", "Verify Email", "Create Account"];
const s1 = z.object({ organization_name: z.string().min(2), organization_slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Lowercase, numbers, hyphens only"), email: z.string().email() });
const s3 = z.object({ full_name: z.string().min(2), password: z.string().min(8), confirm_password: z.string() }).refine(d => d.password === d.confirm_password, { message: "Passwords must match", path: ["confirm_password"] });

export default function Register() {
  const navigate = useNavigate();
  const fetchUser = useAuthStore(s => s.fetchUser);
  const [step, setStep] = useState(0);
  const [otp, setOtp] = useState("");
  const [stepData, setStepData] = useState({});
  const [loading, setLoading] = useState(false);
  const f1 = useForm({ resolver: zodResolver(s1) });
  const f3 = useForm({ resolver: zodResolver(s3) });

  async function handleStep1(data) {
    setLoading(true);
    try { const r = await sendOTP(data.email); if (r.dev_otp) toast.success(`Dev OTP: ${r.dev_otp}`, { duration: 15000 }); setStepData(data); setStep(1); }
    catch (e) { toast.error(e?.response?.data?.detail || "Failed to send OTP"); }
    setLoading(false);
  }
  async function handleVerify() {
    setLoading(true);
    try { await verifyOTP(stepData.email, otp); setStep(2); toast.success("Email verified!"); }
    catch { toast.error("Invalid OTP"); }
    setLoading(false);
  }
  async function handleStep3(data) {
    setLoading(true);
    try { const r = await apiRegister({ ...stepData, full_name: data.full_name, password: data.password }); storeLoginToken(r); await fetchUser(); toast.success("Welcome to ThinkHive!"); navigate("/dashboard"); }
    catch (e) { toast.error(e?.response?.data?.detail || "Registration failed"); }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft size={15} /> Back
          </Link>
          <ThemeToggle />
        </div>

        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
            <Brain size={24} className="text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl text-foreground">Think<span className="text-primary">Hive</span></h1>
          <p className="text-muted-foreground">Register your company</p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  i < step ? "bg-secondary text-secondary-foreground" : i === step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && <div className={`h-px w-14 ${i < step ? "bg-secondary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-8">
          {step === 0 && (
            <form onSubmit={f1.handleSubmit(handleStep1)} className="space-y-4">
              <h2 className="font-display text-lg text-foreground">Company Information</h2>
              {[
                { name: "organization_name", label: "Company Name", placeholder: "Acme Corp" },
                { name: "organization_slug", label: "Company Slug", placeholder: "acme-corp", hint: "Used to login — lowercase, no spaces" },
                { name: "email", label: "Work Email", placeholder: "you@acme.com", type: "email" },
              ].map(({ name, label, placeholder, type = "text", hint }) => (
                <div key={name}>
                  <label className="mb-1 block text-sm text-foreground/70">{label}</label>
                  <input
                    {...f1.register(name)}
                    type={type}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {hint && <p className="mt-0.5 text-xs text-muted-foreground/70">{hint}</p>}
                  {f1.formState.errors[name] && <p className="mt-1 text-xs text-destructive">{f1.formState.errors[name].message}</p>}
                </div>
              ))}
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {loading ? "Sending OTP..." : "Continue →"}
              </button>
            </form>
          )}
          {step === 1 && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
                  <Mail size={22} className="text-primary" />
                </div>
                <h2 className="font-display text-lg text-foreground">Verify Email</h2>
                <p className="text-sm text-muted-foreground">OTP sent to <span className="text-foreground">{stepData.email}</span></p>
              </div>
              <input
                value={otp}
                onChange={e => setOtp(e.target.value)}
                maxLength={6}
                placeholder="123456"
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-center text-2xl tracking-widest text-foreground focus:border-primary focus:outline-none"
              />
              <button onClick={handleVerify} disabled={loading || otp.length !== 6} className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button onClick={() => handleStep1(stepData)} className="w-full text-sm text-muted-foreground hover:text-foreground">Resend OTP</button>
            </div>
          )}
          {step === 2 && (
            <form onSubmit={f3.handleSubmit(handleStep3)} className="space-y-4">
              <h2 className="font-display text-lg text-foreground">Create Account</h2>
              <p className="text-sm text-muted-foreground">You will be the Super Admin of <span className="text-foreground">{stepData.organization_name}</span></p>
              {[
                { name: "full_name", label: "Full Name", placeholder: "Jane Smith" },
                { name: "password", label: "Password", placeholder: "••••••••", type: "password" },
                { name: "confirm_password", label: "Confirm Password", placeholder: "••••••••", type: "password" },
              ].map(({ name, label, placeholder, type = "text" }) => (
                <div key={name}>
                  <label className="mb-1 block text-sm text-foreground/70">{label}</label>
                  <input
                    {...f3.register(name)}
                    type={type}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                  />
                  {f3.formState.errors[name] && <p className="mt-1 text-xs text-destructive">{f3.formState.errors[name].message}</p>}
                </div>
              ))}
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50">
                {loading ? "Creating..." : "Launch Platform"}
              </button>
            </form>
          )}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            Already registered? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}