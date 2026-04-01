import PageHero from "@/components/PageHero";
import { ArrowDown } from "lucide-react";

export default function MentoringPricePage() {
  return (
    <main>
      <PageHero
        imageUrl="/images/teach.jpg"
        heroStyle={{ backgroundPosition: "center 60%" }}
        lines={["1:1 학습 컨설팅", "이용료 및 신청 방법 안내"]}
        crumbs={[
          { label: "1:1 학습 컨설팅", href: "/mentoring/management" },
          { label: "이용료 및 신청 방법" },
        ]}
      />

      <section
        className="w-full px-4 pb-16 pt-0 md:px-6 md:pb-20 lg:px-8"
        style={{ marginTop: "80px" }}
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="motion-rise mb-0 mt-0 text-center text-3xl font-bold leading-tight text-gray-900 md:text-4xl md:mb-0">
            <span className="block">1:1 학습 컨설팅</span>
            <span className="block">이용료 및 신청 방법은 다음과 같습니다</span>
          </h2>

          <div className="mt-16 flex flex-col md:mt-20">
            {/* 1) 신청 방법 */}
            <div className="motion-rise motion-delay-1 mx-auto w-full max-w-4xl rounded-2xl bg-slate-800 px-4 py-5 text-center text-white shadow-md sm:px-6 sm:py-6">
              <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                신청 방법
              </h3>
              <p className="mt-3 max-w-2xl mx-auto text-sm leading-relaxed text-slate-100 sm:mt-4 sm:max-w-3xl sm:text-base sm:leading-relaxed">
                로드맵 독서실로 문의하신 후, 아래의 두 가지 상담 중 원하시는 것을
                말씀해주시면 됩니다.
                <span className="mt-2 block sm:mt-2.5">
                  상담 가능 인원이 한정적이기 때문에 대기가 발생할 수 있다는 점 양해
                  부탁드립니다.
                </span>
              </p>
            </div>

            {/* 화살표: 신청 방법 → 상담 유형 선택 */}
            <div
              className="motion-rise motion-delay-2 flex justify-center py-4 md:py-5"
              aria-hidden="true"
            >
              <ArrowDown
                className="h-8 w-8 text-gray-400"
                strokeWidth={1.75}
              />
            </div>

            {/* 상담 카드 2열 */}
            <div className="motion-rise motion-delay-3 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              <article className="flex flex-col rounded-lg border border-gray-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-7">
                <h3 className="text-center text-lg font-bold text-slate-900 md:text-xl">
                  심층 학습 컨설팅
                </h3>
                <ul className="mt-6 space-y-5 text-left text-sm text-slate-700 md:text-base">
                  <li className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                      aria-hidden
                    />
                    <span>
                      <span className="font-semibold text-slate-900">
                        [상담 횟수 및 기간]
                      </span>{" "}
                      4주 동안 총 4회의 상담 진행
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600"
                      aria-hidden
                    />
                    <span>
                      <span className="font-semibold text-slate-900">
                        [상담 비용]
                      </span>{" "}
                      10만원
                    </span>
                  </li>
                </ul>
              </article>

              <article className="flex flex-col rounded-lg border border-gray-300 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-7">
                <h3 className="text-center text-lg font-bold text-slate-900 md:text-xl">
                  일반 학습 컨설팅
                </h3>
                <ul className="mt-6 space-y-5 text-left text-sm text-slate-700 md:text-base">
                  <li className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500"
                      aria-hidden
                    />
                    <span>
                      <span className="font-semibold text-slate-900">
                        [상담 횟수 및 기간]
                      </span>{" "}
                      일회성 상담으로 약 1시간 진행
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-500"
                      aria-hidden
                    />
                    <span>
                      <span className="font-semibold text-slate-900">
                        [상담 비용]
                      </span>{" "}
                      7만원
                    </span>
                  </li>
                </ul>
              </article>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
