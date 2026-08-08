import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Headset,
  Lock,
  LogIn,
  ShieldCheck,
  Sparkles,
  Truck,
  UserPlus,
} from "lucide-react";
import Seo from "../components/common/Seo.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { useToast } from "../context/ToastContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { getSettings } from "../services/catalog.js";
import { toEnDigits } from "../utils/format.js";

const benefits = [
  { icon: Truck, title: "ارسال سریع", desc: "به سراسر کشور" },
  { icon: ShieldCheck, title: "ضمانت اصالت", desc: "کالای ۱۰۰٪ اصل" },
  { icon: Headset, title: "پشتیبانی ۲۴/۷", desc: "همیشه همراه شما" },
];

/**
 * صفحهٔ ورود / ثبت‌نام — نسخهٔ نمایشی (بدون بک‌اند واقعی).
 * ارسال فرم فقط یک توست موفقیت نشان می‌دهد؛ اتصال به API در آینده.
 */
export default function AuthPage({ mode }) {
  const isLogin = mode === "login";
  const { showToast } = useToast();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const loginForm = useForm({
    defaultValues: { identifier: "", password: "", remember: false },
  });

  const registerForm = useForm({
    defaultValues: { name: "", mobile: "", email: "", password: "", confirm: "", terms: false },
  });

  const handleLogin = (data) => {
    login({ identifier: data.identifier });
    showToast(`${data.identifier} عزیز، ورود شما با موفقیت انجام شد`);
    navigate("/");
  };

  const handleRegister = (data) => {
    login({ name: data.name, mobile: data.mobile });
    showToast(`${data.name} عزیز، حساب کاربری شما با موفقیت ساخته شد`);
    navigate("/");
  };

  const toggleMode = () => {
    loginForm.reset();
    registerForm.reset();
    setShowPass(false);
    setShowConfirm(false);
  };

  return (
    <>
      <Seo
        title={isLogin ? "ورود" : "ثبت‌نام"}
        description={
          isLogin
            ? "ورود به حساب کاربری آراز کلین"
            : "ساخت حساب کاربری جدید در فروشگاه آراز کلین"
        }
      />

      <div className="bg-gradient-to-b from-brand-50/70 via-card to-background">
        <div className="mx-auto flex min-h-[calc(100vh-var(--header-offset,122px))] w-full max-w-site items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-card border border-line bg-card shadow-pop lg:grid-cols-[1fr_1.15fr]">
            {/* ─── پنل برند (فقط دسکتاپ) ─── */}
            <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-bl from-brand-600 via-brand-500 to-trust-600 p-8 text-white lg:flex">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.5) 1px, transparent 0)",
                  backgroundSize: "22px 22px",
                }}
              />
              <div aria-hidden="true" className="absolute -right-16 -top-16 size-56 rounded-full bg-white/10" />
              <div aria-hidden="true" className="absolute -bottom-20 -left-14 size-64 rounded-full bg-white/5" />

              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-bold backdrop-blur">
                  <Sparkles className="size-3.5" aria-hidden="true" />
                  {getSettings().siteName}
                </span>
                <h1 className="mt-5 text-2xl font-black leading-9">
                  {isLogin ? "خوش آمدید!" : "به خانوادهٔ آراز کلین بپیوندید"}
                </h1>
                <p className="mt-3 text-sm leading-7 text-white/85">
                  {isLogin
                    ? "برای پیگیری سفارش‌ها، مشاهدهٔ سبد خرید و خرید سریع‌تر وارد حساب خود شوید."
                    : "با ثبت‌نام، اولین نفر از تخفیف‌های ویژه و محصولات جدید باخبر شوید."}
                </p>
              </div>

              <ul className="relative space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit.title} className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur">
                      <benefit.icon className="size-5" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-black">{benefit.title}</p>
                      <p className="text-xs text-white/75">{benefit.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </aside>

            {/* ─── فرم ─── */}
            <div className="p-6 sm:p-10">
              {/* تب‌ها */}
              <div
                className="mb-8 grid grid-cols-2 gap-1 rounded-xl bg-background p-1"
                role="tablist"
                aria-label="ورود یا ثبت‌نام"
              >
                <Link
                  to="/login"
                  onClick={toggleMode}
                  role="tab"
                  aria-selected={isLogin}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-colors duration-200 ${
                    isLogin
                      ? "bg-card text-brand-600 shadow-card"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <LogIn className="size-4" aria-hidden="true" />
                  ورود
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMode}
                  role="tab"
                  aria-selected={!isLogin}
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold transition-colors duration-200 ${
                    !isLogin
                      ? "bg-card text-brand-600 shadow-card"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  <UserPlus className="size-4" aria-hidden="true" />
                  ثبت‌نام
                </Link>
              </div>

              {isLogin ? (
                /* ─────── ورود ─────── */
                <form onSubmit={loginForm.handleSubmit(handleLogin)} noValidate>
                  <h2 className="text-xl font-black text-ink">ورود به حساب کاربری</h2>
                  <p className="mt-1 text-sm text-muted">
                    شمارهٔ موبایل یا ایمیل خود را وارد کنید.
                  </p>

                  <div className="mt-6 space-y-4">
                    <Input
                      label="شماره موبایل یا ایمیل"
                      name="identifier"
                      dir="ltr"
                      placeholder="09123456789 یا you@example.com"
                      autoComplete="username"
                      error={loginForm.formState.errors.identifier?.message}
                      {...loginForm.register("identifier", {
                        required: "شماره موبایل یا ایمیل را وارد کنید",
                        validate: (v) => {
                          const val = toEnDigits(v.trim());
                          const isMobile = /^09\d{9}$/.test(val);
                          const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
                          return isMobile || isEmail || "شماره موبایل یا ایمیل معتبر نیست";
                        },
                      })}
                    />

                    <div>
                      <label htmlFor="password" className="mb-1.5 block text-sm font-bold text-ink">
                        رمز عبور
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPass ? "text" : "password"}
                          autoComplete="current-password"
                          placeholder="••••••••"
                          className={`w-full rounded-xl border bg-card px-4 py-2.5 ps-10 pe-4 text-sm text-ink placeholder:text-muted/60 transition-colors duration-200 focus:outline-none focus:ring-4 ${
                            loginForm.formState.errors.password
                              ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                              : "border-line focus:border-brand-500 focus:ring-brand-500/15"
                          }`}
                          {...loginForm.register("password", {
                            required: "رمز عبور را وارد کنید",
                            minLength: {
                              value: 6,
                              message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
                            },
                          })}
                        />
                        <Lock
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((s) => !s)}
                          aria-label={showPass ? "پنهان کردن رمز" : "نمایش رمز"}
                          className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted/60 transition-colors hover:text-brand-600"
                        >
                          {showPass ? (
                            <EyeOff className="size-4" aria-hidden="true" />
                          ) : (
                            <Eye className="size-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                      {loginForm.formState.errors.password && (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          {loginForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <label className="flex cursor-pointer items-center gap-2 text-xs text-muted">
                        <input
                          type="checkbox"
                          className="size-4 accent-brand-500"
                          {...loginForm.register("remember")}
                        />
                        مرا به خاطر بسپار
                      </label>
                      <Link
                        to="/login"
                        onClick={() => showToast("بازیابی رمز عبور به‌زودی فعال می‌شود", "info")}
                        className="text-xs font-bold text-brand-600 transition-colors hover:text-brand-700"
                      >
                        فراموشی رمز عبور؟
                      </Link>
                    </div>

                    <Button type="submit" size="lg" fullWidth>
                      <LogIn className="size-4 -scale-x-100" aria-hidden="true" />
                      ورود
                    </Button>
                  </div>

                  <p className="mt-6 text-center text-sm text-muted">
                    حساب ندارید؟{" "}
                    <Link
                      to="/register"
                      onClick={toggleMode}
                      className="font-bold text-brand-600 transition-colors hover:text-brand-700"
                    >
                      ثبت‌نام کنید
                    </Link>
                  </p>
                </form>
              ) : (
                /* ─────── ثبت‌نام ─────── */
                <form onSubmit={registerForm.handleSubmit(handleRegister)} noValidate>
                  <h2 className="text-xl font-black text-ink">ساخت حساب کاربری</h2>
                  <p className="mt-1 text-sm text-muted">
                    با چند ثانیه ثبت‌نام، خرید را سریع‌تر شروع کنید.
                  </p>

                  <div className="mt-6 space-y-4">
                    <Input
                      label="نام و نام خانوادگی"
                      name="name"
                      placeholder="مثلاً مریم احمدی"
                      autoComplete="name"
                      error={registerForm.formState.errors.name?.message}
                      {...registerForm.register("name", {
                        required: "نام و نام خانوادگی را وارد کنید",
                        minLength: { value: 3, message: "نام باید حداقل ۳ حرف باشد" },
                      })}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input
                        label="شماره موبایل"
                        name="mobile"
                        dir="ltr"
                        placeholder="09123456789"
                        autoComplete="tel"
                        error={registerForm.formState.errors.mobile?.message}
                        {...registerForm.register("mobile", {
                          required: "شماره موبایل را وارد کنید",
                          validate: (v) =>
                            /^09\d{9}$/.test(toEnDigits(v.trim())) ||
                            "شماره موبایل معتبر نیست",
                        })}
                      />
                      <Input
                        label="ایمیل (اختیاری)"
                        name="email"
                        type="email"
                        dir="ltr"
                        placeholder="you@example.com"
                        autoComplete="email"
                        error={registerForm.formState.errors.email?.message}
                        {...registerForm.register("email", {
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "ایمیل معتبر نیست",
                          },
                        })}
                      />
                    </div>

                    <div>
                      <label htmlFor="reg-password" className="mb-1.5 block text-sm font-bold text-ink">
                        رمز عبور
                      </label>
                      <div className="relative">
                        <input
                          id="reg-password"
                          type={showPass ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="حداقل ۶ کاراکتر"
                          className={`w-full rounded-xl border bg-card px-4 py-2.5 ps-10 pe-4 text-sm text-ink placeholder:text-muted/60 transition-colors duration-200 focus:outline-none focus:ring-4 ${
                            registerForm.formState.errors.password
                              ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                              : "border-line focus:border-brand-500 focus:ring-brand-500/15"
                          }`}
                          {...registerForm.register("password", {
                            required: "رمز عبور را وارد کنید",
                            minLength: {
                              value: 6,
                              message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
                            },
                          })}
                        />
                        <Lock
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((s) => !s)}
                          aria-label={showPass ? "پنهان کردن رمز" : "نمایش رمز"}
                          className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted/60 transition-colors hover:text-brand-600"
                        >
                          {showPass ? (
                            <EyeOff className="size-4" aria-hidden="true" />
                          ) : (
                            <Eye className="size-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                      {registerForm.formState.errors.password && (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          {registerForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="confirm-password" className="mb-1.5 block text-sm font-bold text-ink">
                        تکرار رمز عبور
                      </label>
                      <div className="relative">
                        <input
                          id="confirm-password"
                          type={showConfirm ? "text" : "password"}
                          autoComplete="new-password"
                          placeholder="تکرار رمز عبور"
                          className={`w-full rounded-xl border bg-card px-4 py-2.5 ps-10 pe-4 text-sm text-ink placeholder:text-muted/60 transition-colors duration-200 focus:outline-none focus:ring-4 ${
                            registerForm.formState.errors.confirm
                              ? "border-red-400 focus:border-red-500 focus:ring-red-500/15"
                              : "border-line focus:border-brand-500 focus:ring-brand-500/15"
                          }`}
                          {...registerForm.register("confirm", {
                            required: "تکرار رمز عبور را وارد کنید",
                            validate: (v) =>
                              v === registerForm.getValues("password") ||
                              "رمزهای عبور یکسان نیستند",
                          })}
                        />
                        <Lock
                          aria-hidden="true"
                          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm((s) => !s)}
                          aria-label={showConfirm ? "پنهان کردن رمز" : "نمایش رمز"}
                          className="absolute left-2 top-1/2 flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-lg text-muted/60 transition-colors hover:text-brand-600"
                        >
                          {showConfirm ? (
                            <EyeOff className="size-4" aria-hidden="true" />
                          ) : (
                            <Eye className="size-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                      {registerForm.formState.errors.confirm && (
                        <p className="mt-1 text-xs font-medium text-red-500">
                          {registerForm.formState.errors.confirm.message}
                        </p>
                      )}
                    </div>

                    <label className="flex cursor-pointer items-start gap-2 text-xs leading-6 text-muted">
                      <input
                        type="checkbox"
                        className="mt-0.5 size-4 shrink-0 accent-brand-500"
                        {...registerForm.register("terms", {
                          required: "برای ادامه، قوانین را بپذیرید",
                        })}
                      />
                      <span>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            showToast("قوانین و مقررات به‌زودی اضافه می‌شود", "info");
                          }}
                          className="font-bold text-brand-600 transition-colors hover:text-brand-700"
                        >
                          قوانین و مقررات
                        </a>{" "}
                        و{" "}
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            showToast("حریم خصوصی به‌زودی اضافه می‌شود", "info");
                          }}
                          className="font-bold text-brand-600 transition-colors hover:text-brand-700"
                        >
                          حریم خصوصی
                        </a>{" "}
                        آراز کلین را می‌پذیرم.
                      </span>
                    </label>
                    {registerForm.formState.errors.terms && (
                      <p className="text-xs font-medium text-red-500">
                        {registerForm.formState.errors.terms.message}
                      </p>
                    )}

                    <Button type="submit" size="lg" fullWidth>
                      <UserPlus className="size-4" aria-hidden="true" />
                      ساخت حساب کاربری
                    </Button>
                  </div>

                  <p className="mt-6 text-center text-sm text-muted">
                    قبلاً ثبت‌نام کرده‌اید؟{" "}
                    <Link
                      to="/login"
                      onClick={toggleMode}
                      className="font-bold text-brand-600 transition-colors hover:text-brand-700"
                    >
                      وارد شوید
                    </Link>
                  </p>
                </form>
              )}

              <p className="mt-6 text-center text-[11px] leading-6 text-muted/80">
                این صفحه نسخهٔ نمایشی است؛ ثبت‌نام و ورود واقعی به‌زودی فعال می‌شود.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
