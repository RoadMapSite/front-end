/**
 * Heyzine 플립북 — 심층 학습 컨설팅 안내 책자 (새 탭).
 */
const HEYZINE_FLIP_BOOK_URL =
  "https://heyzine.com/flip-book/d662585ab5.html";

export function DeepConsultingBooklet() {
  return (
    <>
      <div className="mb-12 mt-24 text-center md:mt-28 md:mb-16">
        <p className="text-lg font-medium text-gray-600 md:text-xl">
          더 자세한 심층 학습 컨설팅 정보는
        </p>
        <p className="mt-1 text-2xl font-extrabold text-gray-900 md:text-3xl">
          하단의 안내 책자 보기 버튼을 클릭해 확인해주세요
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        <a
          href={HEYZINE_FLIP_BOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-slate-900 px-8 py-3 text-base font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:bg-slate-800"
        >
          심층 학습 컨설팅 안내 책자 보기
        </a>
      </div>
    </>
  );
}
