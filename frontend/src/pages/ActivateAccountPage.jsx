import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Brain, KeyRound } from "lucide-react";
import { activateAccount, resendActivation } from "../services/api";
import { storeLoginToken } from "../services/auth";
import { useAuthStore } from "../store/useAuthStore";

export default function ActivateAccountPage() {
  const navigate = useNavigate();
  const fetchUser = useAuthStore(s => s.fetchUser);
  const [form, setForm] = useState({ organization_slug: "", email: "", otp: "", new_password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);

  function update(name, value) { setForm(p => ({ ...p, [name]: value })); }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.new_password !== form.confirm_password) { toast.error("Passwords must match"); return; }
    if (form.new_password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      const r = await activateAccount({
        organization_slug: form.organization_slug,
        email: form.email,
        otp: form.otp,
        new_password: form.new_password,
      });
      storeLoginToken(r);
      await fetchUser();
      toast.success("Account activated!");
      navigate("/dashboard");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Activation failed");
    }
    setLoading(false);
  }

  async function handleResend() {
    if (!form.organization_slug || !form.email) { toast.error("Enter your organization and email first"); return; }
    try {
      await resendActivation({ organization_slug: form.organization_slug, email: form.email });
      toast.success("Code resent — check your email");
    } catch (e) {
      toast.error(e?.response?.data?.detail || "Failed to resend code");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0F1A] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4F8EF7]"><Brain size={24} className="text-white" /></div>
          <h1 className="text-2xl font-bold text-white">Think<span className="text-[#4F8EF7]">Hive</span></h1>
          <p className="text-white/50">Activate your account</p>
        </div>
        <div className="rounded-2xl border border-[#1C2540] bg-[#131929] p-8">
          <div className="mb-5 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#4F8EF7]/20"><KeyRound size={22} className="text-[#4F8EF7]" /></div>
            <p className="text-sm text-white/50">Enter the code emailed to you and choose your password</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "organization_slug", label: "Organization Slug", placeholder: "acme-corp" },
              { name: "email", label: "Work Email", placeholder: "you@acme.com", type: "email" },
              { name: "otp", label: "Setup Code", placeholder: "123456" },
              { name: "new_password", label: "New Password", placeholder: "••••••••", type: "password" },
              { name: "confirm_password", label: "Confirm Password", placeholder: "••••••••", type: "password" },
            ].map(({ name, label, placeholder, type = "text" }) => (
              <div key={name}>
                <label className="mb-1 block text-sm text-white/70">{label}</label>
                <input
                  type={type} value={form[name]} placeholder={placeholder}
                  onChange={e => update(name, e.target.value)}
                  className="w-full rounded-lg border border-[#1C2540] bg-[#0B0F1A] px-4 py-2.5 text-white placeholder:text-white/30 focus:border-[#4F8EF7] focus:outline-none"
                />
              </div>
            ))}
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-[#4F8EF7] py-3 text-sm font-semibold text-white hover:bg-[#4F8EF7]/90 disabled:opacity-50">
              {loading ? "Activating..." : "Activate Account"}
            </button>
            <button type="button" onClick={handleResend} className="w-full text-sm text-white/40 hover:text-white">
              Resend code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}