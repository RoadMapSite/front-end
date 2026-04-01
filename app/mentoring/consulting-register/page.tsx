import PageHero from "@/components/PageHero";
import Image from "next/image";

export default function ConsultingRegisterPage() {
  return (
    <main>
      <PageHero
        imageUrl="/images/teach.jpg"
        heroStyle={{ backgroundPosition: "center 60%" }}
        lines={["1:1 심층 학습 컨설팅", "상담 자료 안내"]}
        crumbs={[
          { label: "1:1 심층 학습 컨설팅", href: "/mentoring/management" },
          { label: "상담 자료" },
        ]}
      />

      <section
        className="w-full px-4 pb-16 pt-0 md:px-6 md:pb-20 lg:px-8"
        style={{ marginTop: "80px" }}
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="motion-rise mb-12 mt-0 text-center text-3xl font-bold leading-tight text-gray-900 md:text-4xl md:mb-16">
            <span className="block">학생의 현재 성적과 학습 상황을 진단하여</span>
            <span className="block">최적의 방향을 설계합니다</span>
          </h2>

          <Image
            src="/images/consultant1.png"
            alt="1:1 상담 안내"
            width={1920}
            height={1080}
            className="motion-rise motion-delay-1 mx-auto h-auto w-full max-w-6xl"
            priority
          />

          <div className="motion-rise motion-delay-2 mt-40">
            <h3 className="mb-12 mt-0 text-center text-3xl font-bold leading-tight text-gray-900 md:text-4xl md:mb-16">
              <span className="block">분석 내용을 바탕으로</span>
              <span className="block">학생에게 학습 가이드 결과지를 제공합니다</span>
            </h3>

            <div className="flex justify-center">
              <a
                href="/files/consulting/심층-학습-상담-결과지.pdf"
                download="심층 학습 상담 결과지.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full max-w-xs overflow-hidden border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  <Image
                    src="/images/consultant2.jpg"
                    alt="학습 가이드 결과지 미리보기"
                    fill
                    unoptimized
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 384px"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                    <span className="text-center text-lg font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      PDF 다운로드
                    </span>
                  </div>
                </div>
                <p className="mt-2 px-2 pb-2 text-center text-sm text-gray-500">
                  미리보기 이미지를 클릭하시면
                  <br />
                  실제 학습 상담 결과 자료를 확인하실 수 있습니다.
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
