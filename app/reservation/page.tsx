"use client";

import { useState } from "react";
import { apiPost } from "@/api/apiClient";

type Season = "SEMESTER_1" | "SEMESTER_2" | "SUMMER" | "WINTER";
type Branch = "N" | "Hi-end";

const SEASON_OPTIONS: { value: Season; label: string }[] = [
  { value: "SEMESTER_1", label: "1학기" },
  { value: "SEMESTER_2", label: "2학기" },
  { value: "SUMMER", label: "여름캠프" },
  { value: "WINTER", label: "겨울캠프" },
];

const BRANCH_OPTIONS: { value: Branch; label: string }[] = [
  { value: "N", label: "N수생관" },
  { value: "Hi-end", label: "하이엔드관" },
];

interface SendAuthResponse {
  success: boolean;
  message: string;
}

async function sendVerificationCode(phoneNumber: string): Promise<SendAuthResponse> {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  return apiPost<SendAuthResponse>("v1/common/auth/send", { phoneNumber: digitsOnly });
}

interface VerifyAuthResponse {
  success: boolean;
  message: string;
  verificationToken: string;
}

async function verifyAuthCode(phoneNumber: string, authCode: string): Promise<VerifyAuthResponse> {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  return apiPost<VerifyAuthResponse>("v1/common/auth/verify", {
    phoneNumber: digitsOnly,
    authCode: authCode.trim(),
  });
}

interface SubmitWaitlistResponse {
  success: boolean;
  message: string;
  waitlistId?: number;
  registeredAt?: string;
}

async function submitWaitlist(
  payload: {
    branch: string | null;
    season: Season;
    name: string;
    age: number;
    phoneNumber: string;
  },
  verificationToken: string
): Promise<SubmitWaitlistResponse> {
  const body: Record<string, unknown> = {
    season: payload.season,
    name: payload.name.trim(),
    age: payload.age,
    phoneNumber: payload.phoneNumber.replace(/\D/g, ""),
  };
  if (payload.branch != null) {
    body.branch = payload.branch;
  }
  return apiPost<SubmitWaitlistResponse>("v1/user/waitlists", body, { token: verificationToken });
}

const needsBranch = (season: Season) => season === "SEMESTER_1" || season === "SEMESTER_2";

export default function ReservationPage() {
  const [season, setSeason] = useState<Season | null>(null);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [sendCodeError, setSendCodeError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);

  const showBranchSelection = season !== null && needsBranch(season);

  const handleSeasonChange = (s: Season) => {
    setSeason(s);
    if (!needsBranch(s)) {
      setBranch(null);
    } else {
      setBranch(null);
    }
  };

  const handleSendVerification = async () => {
    const trimmed = phoneNumber.trim();
    if (!trimmed) return;
    setSendCodeError(null);
    setSendCodeLoading(true);
    try {
      const data = await sendVerificationCode(trimmed);
      setVerificationSent(true);
      setPhoneVerified(false);
      setVerificationCode("");
      setVerificationToken(null);
      if (data.message) alert(data.message);
    } catch (err) {
      setSendCodeError(err instanceof Error ? err.message : "인증번호 발송에 실패했습니다.");
    } finally {
      setSendCodeLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const code = verificationCode.trim();
    if (!code) return;
    setVerifyError(null);
    setVerifyLoading(true);
    try {
      const data = await verifyAuthCode(phoneNumber.trim(), code);
      setVerificationToken(data.verificationToken);
      setPhoneVerified(true);
      if (data.message) alert(data.message);
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "인증에 실패했습니다.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !season ||
      !name.trim() ||
      !age.trim() ||
      !phoneNumber.trim() ||
      !phoneVerified ||
      !verificationToken
    )
      return;
    if (needsBranch(season) && !branch) return;

    const payload = {
      branch: needsBranch(season) ? branch! : null,
      season,
      name: name.trim(),
      age: parseInt(age, 10),
      phoneNumber: phoneNumber.trim(),
    };

    setIsSubmitting(true);
    try {
      const data = await submitWaitlist(payload, verificationToken);
      if (data.message) alert(data.message);
    } catch (err) {
      alert(err instanceof Error ? err.message : "등록 신청에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit =
    season &&
    (needsBranch(season) ? branch : true) &&
    name.trim() &&
    age.trim() &&
    phoneNumber.trim() &&
    phoneVerified &&
    verificationToken;

  return (
    <main>
      <section className="w-full py-12 md:py-16">
        <div className="mx-auto max-w-xl px-6">
          {/* 타이틀 */}
          <div className="text-center mb-16">
            <p className="text-gray-500 text-base md:text-lg mb-1">1분 안에</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">등록 예약 해드릴게요!</h2>
          </div>

          {/* 시즌 선택 */}
          <div className="mb-10">
            <h3 className="text-gray-900 font-medium text-base mb-2">시즌을 선택해주세요</h3>
            <hr className="border-gray-200 mb-4" />
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {SEASON_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSeasonChange(opt.value)}
                  className={`cursor-pointer py-3 px-6 rounded-lg border text-base font-medium transition-colors ${
                    season === opt.value
                      ? "bg-slate-800 text-white border-slate-800 hover:bg-slate-700"
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 관 종류 (1학기/2학기 선택 시에만) */}
          {showBranchSelection && (
            <div className="mb-10">
              <h3 className="text-gray-900 font-medium text-base mb-2">관 종류를 선택해주세요</h3>
              <hr className="border-gray-200 mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {BRANCH_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setBranch(opt.value)}
                    className={`cursor-pointer py-3 px-6 rounded-lg border text-base font-medium transition-colors ${
                      branch === opt.value
                        ? "bg-slate-800 text-white border-slate-800 hover:bg-slate-700"
                        : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 간단한 정보 */}
          <form onSubmit={handleSubmit}>
            <h3 className="text-gray-900 font-medium text-base mb-2">간단한 정보만 적어주세요</h3>
            <hr className="border-gray-100 mb-3" />

            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="이름을 적어주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 bg-gray-50/50"
              />
              <input
                type="number"
                min={1}
                max={99}
                placeholder="나이를 입력해주세요"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 bg-gray-50/50"
              />
              <div className="flex rounded-xl border border-gray-200 overflow-hidden bg-gray-50/50">
                <input
                  type="tel"
                  placeholder="핸드폰번호를 적어주세요"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 py-3 px-4 border-0 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-0 bg-transparent"
                />
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={sendCodeLoading}
                  className="shrink-0 cursor-pointer py-3 px-5 bg-gray-100 text-gray-600 text-base font-medium hover:bg-gray-200 whitespace-nowrap border-l border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sendCodeLoading ? "발송 중…" : "인증번호 받기"}
                </button>
              </div>
              {sendCodeError && <p className="text-sm text-red-600">{sendCodeError}</p>}
              <input
                type="text"
                placeholder="인증번호를 입력해주세요"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  setPhoneVerified(false);
                  setVerificationToken(null);
                }}
                disabled={phoneVerified}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-gray-300 bg-gray-50/50 disabled:bg-gray-50 disabled:text-gray-500"
              />
              {verifyError && <p className="text-sm text-red-600">{verifyError}</p>}
              {verificationSent && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    disabled={phoneVerified || verifyLoading || !verificationCode.trim()}
                    className="cursor-pointer py-3 px-5 rounded-xl border border-gray-200 bg-gray-100 text-gray-600 text-base font-medium hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                  >
                    {phoneVerified ? "인증 완료" : verifyLoading ? "확인 중…" : "인증하기"}
                  </button>
                  {phoneVerified && (
                    <p className="text-sm text-slate-600 font-medium">휴대폰 번호가 인증되었습니다.</p>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !canSubmit}
              className="w-full cursor-pointer py-4 rounded-xl bg-gray-700 text-white text-base font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              등록 신청
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
