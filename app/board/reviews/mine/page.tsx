"use client";

import { useState, useEffect, useLayoutEffect, useCallback } from "react";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import { Trash2 } from "lucide-react";
import { useFadeIn } from "@/hooks/useFadeIn";
import { apiGet, apiDelete, AUTH_TOKEN_KEY, TOKEN_KEYS_TO_CLEAR, ApiError } from "@/api/apiClient";
import { sendVerificationCode, verifyAuthCode } from "@/api/auth";
import MessageModal from "@/components/MessageModal";

type ReviewStatus = "PENDING" | "APPROVED";

interface MyReview {
  reviewId: number;
  title: string;
  authorName: string;
  status: ReviewStatus;
  createdAt: string;
}

interface MyReviewsResponse {
  myReviews: MyReview[];
}

/** GET /v1/user/reviews/mine - token은 localStorage에 저장된 verificationToken을 apiClient가 전역으로 Authorization 헤더에 주입 */
async function fetchMyReviews(): Promise<MyReviewsResponse> {
  return apiGet<MyReviewsResponse>("/v1/user/reviews/mine", { skipUnauthorizedRedirect: true });
}

interface DeleteReviewResponse {
  success: boolean;
  message: string;
}

async function deleteReview(reviewId: number): Promise<DeleteReviewResponse> {
  return apiDelete<DeleteReviewResponse>(`/v1/user/reviews/${reviewId}`, { skipUnauthorizedRedirect: true });
}

/** error 상태 문자열에서 인증 실패 여부 추정 (ApiError status로 잡지 못한 경우의 안전망) */
function authFailureMessageHint(msg: string): boolean {
  const m = msg.trim();
  if (!m) return false;
  if (/만료/.test(m)) return true;
  if (/인증 토큰/.test(m)) return true;
  if (/다시 진행/.test(m)) return true;
  if (/유효하지\s*않/.test(m)) return true;
  return false;
}

/** 목록/삭제 API에서 만료·무효 토큰으로 실패했을 때 */
function isAuthFailureError(err: unknown): boolean {
  if (err instanceof ApiError) return err.status === 401 || err.status === 403;
  return authFailureMessageHint(err instanceof Error ? err.message : String(err));
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  } catch {
    return iso;
  }
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  const isPending = status === "PENDING";
  const label = isPending ? "승인 대기" : "노출 중";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
        isPending
          ? "bg-amber-500/12 text-amber-700 ring-1 ring-amber-500/20"
          : "bg-emerald-500/12 text-emerald-700 ring-1 ring-emerald-500/20"
      }`}
    >
      {label}
    </span>
  );
}

export default function MyReviewsPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [reviews, setReviews] = useState<MyReview[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendCodeLoading, setSendCodeLoading] = useState(false);
  const [sendCodeError, setSendCodeError] = useState<string | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [phoneAuthModalMessage, setPhoneAuthModalMessage] = useState<string | null>(null);

  const resetSessionForReauth = useCallback((notice: string | null) => {
    if (typeof window !== "undefined") {
      TOKEN_KEYS_TO_CLEAR.forEach((key) => localStorage.removeItem(key));
    }
    setPhoneVerified(false);
    setVerificationToken(null);
    setReviews(null);
    setError(null);
    setVerificationSent(false);
    setVerificationCode("");
    setVerifyError(null);
    if (notice) setPhoneAuthModalMessage(notice);
  }, []);

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
      setReviews(null);
      if (typeof window !== "undefined") localStorage.removeItem(AUTH_TOKEN_KEY);
      if (data.message) {
        setPhoneAuthModalMessage(data.message);
      }
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
      const token = data.verificationToken;
      setVerificationToken(token);
      setPhoneVerified(true);
      if (token && typeof window !== "undefined") localStorage.setItem(AUTH_TOKEN_KEY, token);
      if (data.message) setPhoneAuthModalMessage(data.message);
    } catch (err) {
      setVerifyError(err instanceof Error ? err.message : "인증에 실패했습니다.");
    } finally {
      setVerifyLoading(false);
    }
  };

  const handleLoadReviews = async () => {
    if (!verificationToken) return;
    setError(null);
    setLoading(true);
    try {
      const data = await fetchMyReviews();
      setReviews(data.myReviews ?? []);
    } catch (err) {
      if (isAuthFailureError(err)) {
        resetSessionForReauth(
          err instanceof Error ? err.message : "인증이 만료되었습니다. 휴대폰 인증을 다시 진행해 주세요."
        );
      } else {
        setError(err instanceof Error ? err.message : "목록을 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId: number) => {
    if (!verificationToken) return;
    if (!window.confirm("정말 이 후기를 삭제하시겠습니까?")) return;
    setDeletingId(reviewId);
    try {
      await deleteReview(reviewId);
      setReviews((prev) => (prev ?? []).filter((r) => r.reviewId !== reviewId));
      setPhoneAuthModalMessage("후기가 삭제되었습니다.");
    } catch (err) {
      if (isAuthFailureError(err)) {
        resetSessionForReauth(
          err instanceof Error ? err.message : "인증이 만료되었습니다. 휴대폰 인증을 다시 진행해 주세요."
        );
      } else {
        setPhoneAuthModalMessage(err instanceof Error ? err.message : "삭제에 실패했습니다.");
      }
    } finally {
      setDeletingId(null);
    }
  };

  const fade = useFadeIn(0.1);

  useLayoutEffect(() => {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      if (token?.trim()) {
        setVerificationToken(token);
        setPhoneVerified(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (phoneVerified && verificationToken && reviews === null && !loading && !error) {
      handleLoadReviews();
    }
  }, [phoneVerified, verificationToken, reviews, loading, error]);

  /** catch에서 놓친 인증 오류가 error로만 남은 경우 — paint 전에 세션 초기화해 안내 박스만 보이지 않게 함 */
  useLayoutEffect(() => {
    if (!error || !phoneVerified) return;
    if (!authFailureMessageHint(error)) return;
    resetSessionForReauth(error);
  }, [error, phoneVerified, resetSessionForReauth]);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <PageHero
        imageUrl="/images/note.jpg"
        heroStyle={{ backgroundPosition: "center 5%" }}
        lines={["내가 작성한 후기 조회"]}
        crumbs={[
          { label: "이용 후기", href: "/board/reviews" },
          { label: "내가 작성한 후기 조회", href: "/board/reviews/mine" },
        ]}
      />

      <section
        ref={fade.ref}
        className="mx-auto max-w-5xl px-4 sm:px-6 py-10 lg:py-14 transition-all duration-700 ease-out"
        style={{
          opacity: fade.isVisible ? 1 : 0,
          transform: fade.isVisible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        {!phoneVerified ? (
          <div className="mx-auto max-w-md">
            <h2 className="mb-16 mt-0 text-center text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
              <span className="block whitespace-nowrap">휴대폰 인증 후</span>
              <span className="block whitespace-nowrap -translate-x-7">내가 작성한 후기를 확인할 수 있어요</span>
            </h2>
            <div className="mt-2 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
              <div className="space-y-3">
                <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-gray-50/50">
                  <input
                    type="tel"
                    placeholder="휴대폰 번호를 입력해주세요"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="flex-1 py-2.5 px-3.5 border-0 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 bg-transparent"
                  />
                  <button
                    type="button"
                    onClick={handleSendVerification}
                    disabled={sendCodeLoading}
                    className="shrink-0 py-2.5 px-3.5 bg-gray-100 text-slate-600 text-sm font-medium hover:bg-gray-200 whitespace-nowrap border-l border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {sendCodeLoading ? "발송 중…" : "인증번호 받기"}
                  </button>
                </div>
                {sendCodeError && <p className="text-sm text-red-600">{sendCodeError}</p>}
                {verificationSent && (
                  <>
                    <div className="flex rounded-xl border border-slate-200 overflow-hidden bg-gray-50/50">
                      <input
                        type="text"
                        placeholder="인증번호를 입력해주세요"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="flex-1 py-2.5 px-3.5 border-0 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0 bg-transparent"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyCode}
                        disabled={verifyLoading || !verificationCode.trim()}
                        className="shrink-0 py-2.5 px-3.5 bg-gray-100 text-slate-600 text-sm font-medium hover:bg-gray-200 whitespace-nowrap border-l border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {verifyLoading ? "확인 중…" : "인증하기"}
                      </button>
                    </div>
                    {verifyError && <p className="text-sm text-red-600">{verifyError}</p>}
                  </>
                )}
              </div>
            </div>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
            <p className="mt-4 text-sm">목록을 불러오는 중…</p>
          </div>
        ) : error && phoneVerified && authFailureMessageHint(error) ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
            <p className="mt-4 text-sm">인증이 필요합니다. 잠시만요…</p>
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200/60">
            <p className="text-red-600">{error}</p>
            <Link href="/board/reviews" className="mt-4 inline-block text-sm text-emerald-600 hover:underline">
              이용 후기 목록으로
            </Link>
          </div>
        ) : reviews && reviews.length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm ring-1 ring-slate-200/60">
            <p className="text-slate-600">아직 작성한 후기가 없어요.</p>
            <Link
              href="/board/reviews/register"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-slate-700 hover:shadow"
            >
              후기 작성하기
            </Link>
          </div>
        ) : reviews && reviews.length > 0 ? (
          <>
            <div className="mb-6">
              <p className="text-sm text-slate-500">총 {reviews.length}건의 후기</p>
            </div>
            <div className="lg:hidden space-y-3">
              {reviews.map((item, index) => (
                <div
                  key={item.reviewId}
                  className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium text-slate-400">#{index + 1}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <Link
                    href={`/board/reviews/${item.reviewId}?from=mine`}
                    className="font-semibold text-slate-800"
                  >
                    {item.title}
                  </Link>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-2">
                      <span>{item.authorName}</span>
                      <span>{formatDate(item.createdAt)}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.reviewId)}
                      disabled={deletingId === item.reviewId}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 hidden lg:block overflow-hidden bg-white shadow-sm ring-1 ring-slate-200/60">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-white">
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      번호
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      제목
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      작성자
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      상태
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                      작성일
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-500 w-16">
                      삭제
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reviews.map((item, index) => (
                    <tr key={item.reviewId} className="transition-colors hover:bg-slate-50/70">
                      <td className="px-6 py-4 text-center text-sm font-medium text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/board/reviews/${item.reviewId}?from=mine`}
                          className="font-medium text-slate-800"
                        >
                          {item.title}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-500">
                        {item.authorName}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <StatusBadge status={item.status} />
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-500">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <button
                            type="button"
                            onClick={() => handleDelete(item.reviewId)}
                            disabled={deletingId === item.reviewId}
                            className="inline-flex items-center justify-center rounded-md p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                            title="삭제"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}

        <div className="mt-24 mx-auto max-w-md px-6">
          <Link
            href="/board/reviews"
            className="block w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors text-center"
          >
            이용 후기 목록으로 돌아가기
          </Link>
        </div>
      </section>
      <MessageModal message={phoneAuthModalMessage} onClose={() => setPhoneAuthModalMessage(null)} />
    </main>
  );
}
