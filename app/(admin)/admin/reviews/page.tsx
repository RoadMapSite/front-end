"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Star, X, MessageSquare } from "lucide-react";

type ReviewItem = {
  id: number;
  title: string;
  author: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
  isExcellent: boolean;
  imageUrls?: string[];
};

const LONG_REVIEW_CONTENT = `선생님들이 친절하고 설명도 잘 해주셔서 수능 준비에 큰 도움이 되었습니다. 특히 영어 과목 수업이 인상적이었고, 실전 문제 풀이가 많이 도움됐어요.

저는 고3 재수생인데, 수능 D-200부터 이곳에서 공부를 시작했습니다. 처음에는 학원과 독서실을 여러 곳 알아봤는데, 이곳의 시설과 분위기가 가장 마음에 들어서 등록했어요. 스터디룸이 넓고 쾌적한데다 조용해서 집중이 정말 잘 됐습니다.

영어 선생님께서는 매 수업마다 핵심 문법과 구문을 체계적으로 정리해주셨고, 모의고사 풀이 후에는 개별 첨삭까지 해주셔서 제 실력이 눈에 띄게 늘었어요. 수학도 기초부터 다시 다져주셔서 수능 때 1등급을 받을 수 있었습니다.

관리 선생님들도 정말 친절하십니다. 피로할 때마다 격려해주시고, 진로 상담이나 대학 정보도 알려주셔서 감사했어요. 야간에도 늦게까지 공부하는 학생들을 위해 음료 자판기와 간식도 준비해두셨더라구요.

결과적으로 수능에서 목표했던 성적을 받을 수 있었고, 지금은 제가 원하던 대학에 합격했습니다. 다음 학기에도 동생을 여기로 보낼 생각이에요. 정말 감사했습니다!`;

const DUMMY_REVIEWS: ReviewItem[] = [
  { id: 1, title: "수업 품질이 정말 좋았어요", author: "이종훈", content: LONG_REVIEW_CONTENT, createdAt: "2025-02-20", isApproved: true, isExcellent: true, imageUrls: ["https://picsum.photos/600/400"] },
  { id: 2, title: "분위기가 좋아서 집중이 잘 돼요", author: "백소미", content: "스터디룸이 넓고 쾌적해서 공부하기 딱 좋습니다. 조용한 환경에서 혼자 공부할 수 있어서 효율이 많이 올랐어요. 화장실이나 음수대도 가까워서 편했습니다.", createdAt: "2025-02-21", isApproved: true, isExcellent: false },
  { id: 3, title: "강추합니다!", author: "김은형", content: "친구 추천으로 왔는데 생각보다 훨씬 좋았어요. 관리 선생님께서 수시로 체크해주시고, 진로 상담도 받을 수 있어서 좋았습니다. 수능 D-100부터 여기서 공부했는데 성적이 많이 올랐어요.", createdAt: "2025-02-22", isApproved: true, isExcellent: true },
  { id: 4, title: "시설이 깔끔하고 관리가 잘 돼요", author: "이채영", content: "매일 청소해주시고, 책상과 의자 상태도 좋습니다. 콘센트가 넉넉해서 노트북이나 태블릿 사용하기 편해요. 조명도 적당해서 눈이 편합니다.", createdAt: "2025-02-23", isApproved: false, isExcellent: false },
  { id: 5, title: "가격 대비 만족도 높아요", author: "김준업", content: "다른 학원이나 스터디카페랑 비교해봤을 때 가격 대비 시설과 서비스가 괜찮은 편이에요. 월 이용권도 있고 일일권도 있어서 유연하게 이용할 수 있어서 좋습니다.", createdAt: "2025-02-24", isApproved: true, isExcellent: false },
  { id: 6, title: "재수생에게 추천", author: "강희수", content: "재수하면서 이곳에서 공부했는데 분위기가 딱 맞았어요. 같이 공부하는 친구들도 많아서 동기부여가 되고, 선생님들도 항상 격려해주셔서 힘든 시기 잘 버틸 수 있었습니다.", createdAt: "2025-02-25", isApproved: true, isExcellent: true },
  { id: 7, title: "조용한 환경에서 집중 잘 됐어요", author: "양지원", content: "낮에는 학생들이 많지만 규칙이 잘 지켜져서 조용합니다. 야간에는 더 한적해서 새벽까지 공부할 수 있어요. 24시간 운영이 편리합니다.", createdAt: "2025-02-26", isApproved: true, isExcellent: false },
  { id: 8, title: "시설 신축이라 깔끔합니다", author: "안보석", content: "건물이 새로 지어져서 모든 것이 새롭습니다. 에어컨, 난방 모두 잘 되고 화장실도 넓어요. 주차 공간도 넉넉해서 차 끌고 오기 좋습니다.", createdAt: "2025-02-26", isApproved: false, isExcellent: false },
  { id: 9, title: "진로 상담 서비스가 훌륭해요", author: "문준석", content: "단순히 자습만 하는 게 아니라 진로 상담이나 학습 방법에 대한 조언을 받을 수 있어서 좋았어요. 대입 준비하는 학생들에게 정말 유용할 것 같습니다.", createdAt: "2025-02-27", isApproved: true, isExcellent: true },
  { id: 10, title: "친구들과 함께 스터디하기 좋아요", author: "김지효", content: "소규모 스터디룸이 있어서 친구들과 모여서 공부하기 딱 좋습니다. 그룹 스터디 신청하면 방을 따로 쓸 수 있어서 편했어요. 시험 기간에 활용했습니다.", createdAt: "2025-02-28", isApproved: true, isExcellent: false },
];

function ToggleSwitch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`
        relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full
        transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${checked ? "bg-blue-600" : "bg-slate-200"}
      `}
    >
      <span
        className={`
          pointer-events-none inline-block mt-0.5 h-5 w-5 transform rounded-full bg-white shadow
          transition-transform duration-200 ease-in-out
          ${checked ? "translate-x-5" : "translate-x-0.5"}
        `}
      />
    </button>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(DUMMY_REVIEWS);
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastExiting, setToastExiting] = useState(false);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastExiting(false);
    setToastMessage(message);
    toastTimeoutRef.current = setTimeout(() => {
      setToastExiting(true);
      toastTimeoutRef.current = setTimeout(() => {
        setToastMessage(null);
        setToastExiting(false);
        toastTimeoutRef.current = null;
      }, 700);
    }, 1000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, []);

  const handleTitleClick = (review: ReviewItem) => {
    setSelectedReview(review);
  };

  const handleApprovalToggle = (id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isApproved: !r.isApproved } : r
      )
    );
    const nextState = reviews.find((r) => r.id === id)?.isApproved ? false : true;
    console.log(`[API 호출] PATCH /reviews/${id} - 승인 상태: ${nextState ? "승인됨" : "미승인"}`);
    showToast(nextState ? "✅ 후기가 승인되었습니다." : "✅ 후기가 해제되었습니다.");
  };

  const handleExcellentToggle = (id: number) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, isExcellent: !r.isExcellent } : r
      )
    );
    const nextState = reviews.find((r) => r.id === id)?.isExcellent ? false : true;
    console.log(`[API 호출] PATCH /reviews/${id} - 우수 후기: ${nextState ? "설정" : "해제"}`);
    showToast(nextState ? "✅ 우수 후기가 지정되었습니다." : "✅ 우수 후기가 해제되었습니다.");
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
            <MessageSquare className="h-5 w-5" strokeWidth={2} aria-hidden />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">이용 후기 관리</h1>
        </div>
        <p className="mt-2 text-slate-600">
          고객이 작성한 이용 후기를 검토하고 승인·우수 후기 지정을 관리합니다.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                번호
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                제목
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                작성자
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                작성일
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                승인 여부
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                우수 후기
              </th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review, index) => (
              <tr
                key={review.id}
                className="border-b border-slate-100 last:border-0 transition-colors hover:bg-gray-50"
              >
                <td className="px-6 py-4 text-sm font-medium text-slate-700">
                  {index + 1}
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleTitleClick(review)}
                    className="cursor-pointer text-left text-sm text-slate-800 hover:underline"
                  >
                    {review.title}
                  </button>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {review.author}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {review.createdAt}
                </td>
                <td className="px-6 py-4">
                  <ToggleSwitch
                    checked={review.isApproved}
                    onChange={() => handleApprovalToggle(review.id)}
                  />
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => handleExcellentToggle(review.id)}
                    className="cursor-pointer p-1 transition-transform hover:scale-110"
                    aria-label={review.isExcellent ? "우수 후기 해제" : "우수 후기 지정"}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        review.isExcellent
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedReview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-[logo-transition-fade-in_0.25s_ease-out]"
          onClick={() => setSelectedReview(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-modal-title"
        >
          <div
            className="flex mx-4 w-full max-w-2xl max-h-[85vh] flex-col overflow-hidden rounded-xl bg-white shadow-xl animate-[confirm-modal-appear_0.6s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: fixed */}
            <div className="shrink-0 border-b border-slate-200 p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="review-modal-title"
                    className="text-xl font-bold text-slate-800"
                  >
                    {selectedReview.title}
                  </h2>
                  <div className="mt-2 flex gap-4 pl-2 text-sm text-slate-500">
                    <span>{selectedReview.author}</span>
                    <span>{selectedReview.createdAt}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="shrink-0 cursor-pointer rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                  aria-label="닫기"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body: scrollable */}
            <div className="min-h-0 flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="whitespace-pre-wrap rounded-lg bg-slate-50 p-6 text-slate-700 leading-relaxed">
                {selectedReview.content}
                {selectedReview.imageUrls?.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`후기 이미지 ${i + 1}`}
                    className="mt-4 max-w-full h-auto rounded-lg mb-4"
                  />
                ))}
              </div>
            </div>

            {/* Footer: fixed */}
            <div className="shrink-0 flex justify-end border-t border-slate-200 p-4">
              <button
                type="button"
                onClick={() => setSelectedReview(null)}
                className="cursor-pointer rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {(toastMessage || toastExiting) && (
        <div
          className={`fixed bottom-5 right-5 z-[60] rounded-lg bg-slate-800 px-5 py-3.5 text-sm font-medium text-white shadow-lg ${
            toastExiting
              ? "translate-x-4 opacity-0 pointer-events-none transition-all duration-700 ease-out"
              : "animate-[toast-slide-in_0.5s_ease-out]"
          }`}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
