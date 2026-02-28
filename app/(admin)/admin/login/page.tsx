"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [idError, setIdError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showTransition, setShowTransition] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const idTrimmed = adminId.trim();
    const passwordTrimmed = password.trim();

    const hasIdError = !idTrimmed;
    const hasPasswordError = !passwordTrimmed;

    setIdError(hasIdError ? "관리자 ID를 입력해주세요" : "");
    setPasswordError(hasPasswordError ? "비밀번호를 입력해주세요" : "");

    if (hasIdError || hasPasswordError) {
      return;
    }

    console.log("Admin ID:", idTrimmed);
    console.log("Password:", passwordTrimmed);

    setShowTransition(true);
  };

  useEffect(() => {
    if (!showTransition) return;
    const timer = setTimeout(() => {
      router.push("/admin");
    }, 1000);
    return () => clearTimeout(timer);
  }, [showTransition, router]);

  if (showTransition) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white animate-[logo-transition-fade-in_0.3s_ease-out]">
        <Image
          src="/logo.png"
          alt="로드맵"
          width={200}
          height={200}
          className="animate-[logo-transition-scale_0.5s_ease-out]"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-xl">
        <div
          className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 animate-[login-form-appear_0.45s_ease-out]"
        >
          <h1 className="text-3xl font-bold text-slate-800 text-center mb-10 tracking-tight">
            RoadMap 관리자 로그인
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="adminId"
                className="block text-base font-medium text-slate-700 mb-2"
              >
                관리자 ID
              </label>
              <input
                id="adminId"
                type="text"
                value={adminId}
                onChange={(e) => {
                  setAdminId(e.target.value);
                  if (idError) setIdError("");
                }}
                placeholder="ID를 입력하세요"
                className={`w-full px-5 py-4 text-base border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition ${
                  idError ? "border-red-500" : "border-slate-300"
                }`}
              />
              {idError && (
                <p className="mt-1 text-sm text-red-600 animate-[error-slide-in_0.25s_ease-out]">
                  {idError}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-slate-700 mb-2"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError("");
                }}
                placeholder="비밀번호를 입력하세요"
                className={`w-full px-5 py-4 text-base border rounded-lg focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition ${
                  passwordError ? "border-red-500" : "border-slate-300"
                }`}
              />
              {passwordError && (
                <p className="mt-1 text-sm text-red-600 animate-[error-slide-in_0.25s_ease-out]">
                  {passwordError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-4 px-4 bg-black hover:bg-slate-800 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition text-base"
            >
              로그인
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
