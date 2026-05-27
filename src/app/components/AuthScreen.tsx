import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  ReportProblem as ErrorIcon,
  Security as SecurityIcon,
  Inventory2 as PackageIcon,
} from "@mui/icons-material";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import chorusLogo from "../../assets/c41ddd9636ba0cf84d17b65494aee06fd1254e8a.png";

type AuthStep =
  | "login"
  | "forgot-email"
  | "forgot-otp"
  | "forgot-reset"
  | "forgot-success";

interface AuthScreenProps {
  onAuthenticated: () => void;
}

const SIMULATED_OTP = "1234";

export default function AuthScreen({
  onAuthenticated,
}: AuthScreenProps) {
  const [step, setStep] = useState<AuthStep>("login");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(
        () => setResendTimer(resendTimer - 1),
        1000,
      );
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    if (!loginEmail || !loginPassword) {
      setLoginError("Please enter both email and password.");
      return;
    }
    setLoginLoading(true);
    setTimeout(() => {
      setLoginLoading(false);
      if (loginEmail && loginPassword.length >= 4) {
        toast.success("Login successful! Welcome back.");
        onAuthenticated();
      } else {
        setLoginError(
          "Invalid credentials. Password must be at least 4 characters.",
        );
      }
    }, 1500);
  };

  const handleForgotEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail || !forgotEmail.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setResendTimer(60);
      toast.success(`OTP sent to ${forgotEmail}`, {
        description: `For demo purposes, the OTP is: ${SIMULATED_OTP}`,
        duration: 8000,
      });
      setStep("forgot-otp");
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value
        .replace(/\D/g, "")
        .slice(0, 4)
        .split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 4) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      setOtpError("");
      otpRefs.current[
        Math.min(index + digits.length, 3)
      ]?.focus();
      return;
    }
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");
    if (value && index < 3) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otp.join("");
    if (entered.length !== 4) {
      setOtpError("Please enter the complete 4-digit OTP.");
      return;
    }
    setOtpLoading(true);
    setTimeout(() => {
      setOtpLoading(false);
      if (entered === SIMULATED_OTP) {
        toast.success("OTP verified!");
        setStep("forgot-reset");
      } else setOtpError("Invalid OTP. Please try again.");
    }, 1000);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    setOtp(["", "", "", ""]);
    setOtpError("");
    toast.success(`OTP resent to ${forgotEmail}`, {
      description: `For demo purposes, the OTP is: ${SIMULATED_OTP}`,
      duration: 8000,
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetError("");
    if (!newPassword || newPassword.length < 8) {
      setResetError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError("Passwords do not match.");
      return;
    }
    setResetLoading(true);
    setTimeout(() => {
      setResetLoading(false);
      setStep("forgot-success");
      toast.success("Password reset!");
    }, 1200);
  };

  const resetToLogin = () => {
    setStep("login");
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
    setForgotEmail("");
    setOtp(["", "", "", ""]);
    setOtpError("");
    setNewPassword("");
    setConfirmPassword("");
    setResetError("");
  };

  const getPasswordStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 8) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    if (pw.length >= 12) s++;
    return s;
  };
  const strengthLevel = getPasswordStrength(newPassword);
  const strengthLabel =
    ["", "Weak", "Fair", "Good", "Strong", "Excellent"][
      strengthLevel
    ] || "";
  const strengthColor =
    [
      "",
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-500",
      "bg-green-500",
      "bg-emerald-500",
    ][strengthLevel] || "";

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  // ─────────────────────────────────────────────
  // Shared tokens
  // ─────────────────────────────────────────────

  // Label
  const labelClass =
    "block text-[15px] font-medeium text-[#121321] dark:text-white mb-2";

  // Input: clean white, no bg tint, clear border, no icon inside
  const inputBase =
    "w-full h-[52px] px-4 text-[15px] bg-white dark:bg-[#1e2240] text-[#121321] dark:text-white " +
    "placeholder:text-[#9CA3AF] placeholder:text-[14px] " +
    "border border-[#D1D5DB] dark:border-[#353750] rounded-xl " +
    "focus:outline-none focus:bg-white dark:focus:bg-[#1e2240] " +
    "focus:border-[#121321] dark:focus:border-[#81CCD7] " +
    "focus:ring-2 focus:ring-[#121321]/10 dark:focus:ring-[#81CCD7]/20 " +
    "transition-all";

  // Password input needs pr for the eye button
  const inputPassword = inputBase + " pr-12";

  // Primary CTA
  const btnPrimary =
    "w-full h-[52px] text-[15px] font-medium rounded-xl " +
    "bg-[#121321] hover:bg-[#1e2240] text-white transition-all " +
    "disabled:bg-[#121321]/60 disabled:text-white/70 " +
    "disabled:cursor-not-allowed disabled:hover:bg-[#121321]/60";

  // Spinner
  const Spinner = () => (
    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
  );

  // ─────────────────────────────────────────────
  // Step: Login
  // ─────────────────────────────────────────────
  const renderLogin = () => (
    <motion.div
      key="login"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="text-center mb-8">
        <h1 className="text-[28px] font-medium text-[#121321] dark:text-white leading-tight">
          Log in to your account
        </h1>
        <p className="text-[15px] text-muted-foreground mt-2">
          Welcome back! Choose your log in method.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className={labelClass}>
            Email Address{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="you@company.com"
            value={loginEmail}
            onChange={(e) => {
              setLoginEmail(e.target.value);
              setLoginError("");
            }}
            className={inputBase}
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="login-password"
              className={labelClass.replace("mb-2", "mb-0")}
            >
              Password <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              className="text-[13px] font-medium text-[#121321] dark:text-[#81CCD7] hover:underline"
              onClick={() => setStep("forgot-email")}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => {
                setLoginPassword(e.target.value);
                setLoginError("");
              }}
              className={inputPassword}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <VisibilityOffIcon style={{ fontSize: 20 }} />
              ) : (
                <VisibilityIcon style={{ fontSize: 20 }} />
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {loginError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <ErrorIcon
              style={{ fontSize: 20 }}
              className="text-red-600 dark:text-red-400 shrink-0"
            />
            <p className="text-[14px] text-red-700 dark:text-red-400">
              {loginError}
            </p>
          </motion.div>
        )}

        <button
          type="submit"
          className={btnPrimary}
          disabled={loginLoading}
        >
          {loginLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner /> Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {/* Divider — no background pill, just clean line + text */}
      <div className="relative flex items-center my-7">
        <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#353750]" />
        <span className="mx-4 text-[13px] text-muted-foreground">
          or
        </span>
        <div className="flex-1 h-px bg-[#E5E7EB] dark:bg-[#353750]" />
      </div>

      {/* Google SSO */}
      <button
        type="button"
        className="w-full h-[52px] flex items-center justify-center gap-3 text-[15px] font-medium
          border-2 border-[#E5E7EB] dark:border-[#353750] rounded-xl
          bg-white dark:bg-[#1e2240] text-[#121321] dark:text-white
          hover:bg-[#F9FAFB] dark:hover:bg-[#2d3154] transition-all"
        onClick={() =>
          toast.info("Google Sign-In coming soon!")
        }
      >
        <svg
          className="w-5 h-5 shrink-0"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Continue with Google
      </button>
    </motion.div>
  );

  // ─────────────────────────────────────────────
  // Step: Forgot — Email
  // ─────────────────────────────────────────────
  const renderForgotEmail = () => (
    <motion.div
      key="forgot-email"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <button
        type="button"
        onClick={resetToLogin}
        className="flex items-center gap-1.5 text-[14px] text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowBackIcon style={{ fontSize: 18 }} />
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#121321]/8 dark:bg-[#81CCD7]/20 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-[#121321] dark:text-[#81CCD7]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
            />
          </svg>
        </div>
        <h1 className="text-[26px] font-medium text-[#121321] dark:text-white">
          Forgot Password?
        </h1>
        <p className="text-[15px] text-muted-foreground mt-2 leading-relaxed">
          Enter your email and we'll send you a 4-digit
          verification code
        </p>
      </div>

      <form
        onSubmit={handleForgotEmailSubmit}
        className="space-y-5"
      >
        <div>
          <label
            htmlFor="forgot-email-input"
            className={labelClass}
          >
            Email Address{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            id="forgot-email-input"
            type="email"
            placeholder="you@company.com"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            className={inputBase}
            autoComplete="email"
            autoFocus
          />
        </div>

        <button
          type="submit"
          className={btnPrimary}
          disabled={forgotLoading}
        >
          {forgotLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner /> Sending OTP...
            </span>
          ) : (
            "Send Verification Code"
          )}
        </button>
      </form>
    </motion.div>
  );

  // ─────────────────────────────────────────────
  // Step: Forgot — OTP
  // ─────────────────────────────────────────────
  const renderOtpVerification = () => (
    <motion.div
      key="forgot-otp"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <button
        type="button"
        onClick={() => setStep("forgot-email")}
        className="flex items-center gap-1.5 text-[14px] text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowBackIcon style={{ fontSize: 18 }} />
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#81CCD7]/20 flex items-center justify-center mx-auto mb-4">
          <SecurityIcon
            style={{ fontSize: 30 }}
            className="text-[#121321] dark:text-[#81CCD7]"
          />
        </div>
        <h1 className="text-[26px] font-medium text-[#121321] dark:text-white">
          Verify Your Email
        </h1>
        <p className="text-[15px] text-muted-foreground mt-2 leading-relaxed">
          We sent a 4-digit code to{" "}
          <span className="font-medium text-foreground">
            {forgotEmail}
          </span>
        </p>
      </div>

      <form onSubmit={handleOtpVerify} className="space-y-6">
        <div className="flex justify-center gap-4">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                otpRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={4}
              value={digit}
              onChange={(e) =>
                handleOtpChange(i, e.target.value)
              }
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className={`w-[66px] h-[66px] text-center text-[26px] font-medium rounded-2xl bg-white dark:bg-[#1e2240]
                outline-none transition-all border-2
                ${
                  otpError
                    ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200"
                    : digit
                      ? "border-[#121321] dark:border-[#81CCD7]"
                      : "border-[#D1D5DB] dark:border-[#353750] focus:border-[#121321] dark:focus:border-[#81CCD7] focus:ring-2 focus:ring-[#121321]/10"
                }`}
              autoFocus={i === 0}
            />
          ))}
        </div>

        {otpError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-[14px] text-red-600 dark:text-red-400"
          >
            <ErrorIcon style={{ fontSize: 18 }} /> {otpError}
          </motion.div>
        )}

        <button
          type="submit"
          className={btnPrimary}
          disabled={otpLoading}
        >
          {otpLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner /> Verifying...
            </span>
          ) : (
            "Verify Code"
          )}
        </button>

        <p className="text-[14px] text-center text-muted-foreground">
          Didn't receive the code?{" "}
          {resendTimer > 0 ? (
            <span>Resend in {resendTimer}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="font-medium text-[#121321] dark:text-[#81CCD7] hover:underline"
            >
              Resend Code
            </button>
          )}
        </p>
      </form>
    </motion.div>
  );

  // ─────────────────────────────────────────────
  // Step: Reset Password
  // ─────────────────────────────────────────────
  const renderResetPassword = () => (
    <motion.div
      key="forgot-reset"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#121321]/8 dark:bg-[#81CCD7]/20 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-[#121321] dark:text-[#81CCD7]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>
        <h1 className="text-[26px] font-medium text-[#121321] dark:text-white">
          Reset Password
        </h1>
        <p className="text-[15px] text-muted-foreground mt-2">
          Create a new secure password for your account
        </p>
      </div>

      <form
        onSubmit={handleResetPassword}
        className="space-y-5"
      >
        {/* New password */}
        <div>
          <label htmlFor="new-password" className={labelClass}>
            New Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setResetError("");
              }}
              className={inputPassword}
              autoFocus
            />
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() =>
                setShowNewPassword(!showNewPassword)
              }
            >
              {showNewPassword ? (
                <VisibilityOffIcon style={{ fontSize: 20 }} />
              ) : (
                <VisibilityIcon style={{ fontSize: 20 }} />
              )}
            </button>
          </div>

          {newPassword && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="pt-2"
            >
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((l) => (
                  <div
                    key={l}
                    className={`h-2 flex-1 rounded-full transition-colors ${l <= strengthLevel ? strengthColor : "bg-muted"}`}
                  />
                ))}
              </div>
              <p
                className={`text-[13px] mt-1.5 font-medium ${strengthLevel <= 1 ? "text-red-600" : strengthLevel <= 2 ? "text-orange-600" : strengthLevel <= 3 ? "text-yellow-600" : "text-green-600"}`}
              >
                {strengthLabel}
              </p>
              <div className="mt-2 space-y-1.5">
                {[
                  {
                    check: newPassword.length >= 8,
                    label: "At least 8 characters",
                  },
                  {
                    check: /[A-Z]/.test(newPassword),
                    label: "One uppercase letter",
                  },
                  {
                    check: /[0-9]/.test(newPassword),
                    label: "One number",
                  },
                  {
                    check: /[^A-Za-z0-9]/.test(newPassword),
                    label: "One special character",
                  },
                ].map((r) => (
                  <div
                    key={r.label}
                    className="flex items-center gap-2 text-[13px]"
                  >
                    <CheckCircleIcon
                      style={{ fontSize: 16 }}
                      className={
                        r.check
                          ? "text-green-500"
                          : "text-muted-foreground/40"
                      }
                    />
                    <span
                      className={
                        r.check
                          ? "text-green-700 dark:text-green-400"
                          : "text-muted-foreground"
                      }
                    >
                      {r.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Confirm password */}
        <div>
          <label
            htmlFor="confirm-password"
            className={labelClass}
          >
            Confirm Password{" "}
            <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setResetError("");
              }}
              className={inputPassword}
            />
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? (
                <VisibilityOffIcon style={{ fontSize: 20 }} />
              ) : (
                <VisibilityIcon style={{ fontSize: 20 }} />
              )}
            </button>
          </div>
          {confirmPassword &&
            newPassword !== confirmPassword && (
              <p className="text-[13px] text-red-600 dark:text-red-400 mt-1">
                Passwords do not match
              </p>
            )}
        </div>

        {resetError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          >
            <ErrorIcon
              style={{ fontSize: 20 }}
              className="text-red-600 dark:text-red-400 shrink-0"
            />
            <p className="text-[14px] text-red-700 dark:text-red-400">
              {resetError}
            </p>
          </motion.div>
        )}

        <button
          type="submit"
          className={btnPrimary}
          disabled={resetLoading}
        >
          {resetLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner /> Resetting...
            </span>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>
    </motion.div>
  );

  // ─────────────────────────────────────────────
  // Step: Success
  // ─────────────────────────────────────────────
  const renderSuccess = () => (
    <motion.div
      key="forgot-success"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 15,
          delay: 0.1,
        }}
        className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircleIcon
          style={{ fontSize: 40 }}
          className="text-[#121321] dark:text-white"
        />
      </motion.div>
      <h1 className="text-[26px] font-medium text-[#121321] dark:text-white mb-3">
        Password Reset Complete
      </h1>
      <p className="text-[15px] text-muted-foreground mb-8 leading-relaxed">
        Your password has been reset successfully. You can now
        sign in with your new password.
      </p>
      <button onClick={resetToLogin} className={btnPrimary}>
        Back to Sign In
      </button>
    </motion.div>
  );

  const getCurrentStep = () => {
    switch (step) {
      case "login":
        return renderLogin();
      case "forgot-email":
        return renderForgotEmail();
      case "forgot-otp":
        return renderOtpVerification();
      case "forgot-reset":
        return renderResetPassword();
      case "forgot-success":
        return renderSuccess();
      default:
        return renderLogin();
    }
  };

  const forgotSteps = [
    "forgot-email",
    "forgot-otp",
    "forgot-reset",
  ];
  const showStepper =
    step !== "login" && step !== "forgot-success";

  // ─────────────────────────────────────────────
  // Layout
  // ─────────────────────────────────────────────
  return (
    <div className="min-h-screen flex bg-[#F3F4F6] dark:bg-[#0d0f1a]">
      {/* ── Left branding panel ── */}
      <div className="hidden lg:flex lg:w-[650px] relative overflow-hidden bg-[#121321] flex-col justify-between p-12">
        {/* BG image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1624927637280-f033784c1279?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXJlaG91c2UlMjBpbnZlbnRvcnklMjBtYW5hZ2VtZW50JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzI0NjIxMjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#121321]/80 via-[#121321]/60 to-[#121321]/95" />

        {/* Logo — scaled up */}
        <div className="relative z-10">
          <img
            src={chorusLogo}
            alt="Chorus"
            className="h-18 w-auto"
          />
        </div>

        {/* Hero text — scaled up */}
        <div className="relative z-10 space-y-5">
          <h2 className="text-[36px] font-medium text-white leading-tight">
            Asset Management System
          </h2>
          <p className="text-white/60 text-[17px] leading-relaxed max-w-md">
            Track and manage assets with real-time inspection
            updates and reporting
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-[13px] text-white/30">
          &copy; 2026 Chorus AMS. All rights reserved.
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[460px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#121321] flex items-center justify-center">
                <PackageIcon
                  style={{ fontSize: 22 }}
                  className="text-white"
                />
              </div>
              <div>
                <p className="text-[16px] font-bold text-[#121321] dark:text-white">
                  Chorus AMS
                </p>
                <p className="text-[12px] text-muted-foreground">
                  Asset Management System
                </p>
              </div>
            </div>
          </div>

          {/* Card — more rounded to match reference */}
          <div className="bg-white dark:bg-[#1a1c2e] rounded-2xl shadow-xl border border-[#E5E7EB] dark:border-[#353750] p-8 sm:p-10">
            <AnimatePresence mode="wait">
              {getCurrentStep()}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
