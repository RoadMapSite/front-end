"use client";

type MessageModalProps = {
  message: string | null;
  onClose: () => void;
};

/** 관리자 로그인 오류 모달과 동일한 스타일의 단일 확인 모달 */
export default function MessageModal({ message, onClose }: MessageModalProps) {
  if (!message) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[280px] bg-black/50 animate-[logo-transition-fade-in_0.3s_ease-out]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-modal-text"
    >
      <div
        className="mx-4 w-full max-w-xl rounded-xl bg-white p-10 shadow-xl animate-[confirm-modal-appear_0.6s_ease-out]"
        onClick={(e) => e.stopPropagation()}
      >
        <p id="message-modal-text" className="mb-8 text-center text-base text-slate-700">
          {message}
        </p>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-slate-700 px-8 py-3 text-base font-medium text-white hover:bg-slate-800 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
