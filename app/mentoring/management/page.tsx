import PageHero from "@/components/PageHero";
import { DeepConsultingBooklet } from "@/components/DeepConsultingBooklet";
import Image from "next/image";

export default function MentoringManagementPage() {
  return (
    <main>
      <PageHero
        imageUrl="/images/teach.jpg"
        heroStyle={{ backgroundPosition: "center 55%" }}
        lines={["로드맵만의", "1:1 심층 학습 컨설팅을 소개합니다"]}
        crumbs={[
          { label: "1:1 심층 학습 컨설팅", href: "/mentoring/management" },
          { label: "관리 내용" },
        ]}
      />

      <section
        className="w-full px-4 pb-16 pt-0 md:px-6 md:pb-20 lg:px-8"
        style={{ marginTop: "80px" }}
      >
        <div className="mx-auto w-full max-w-6xl px-6">
          <h2 className="motion-rise mb-0 mt-0 text-center text-3xl font-bold leading-tight text-gray-900 md:text-4xl md:mb-0">
            <span className="block">로드맵이 제시하는 1:1 심층 학습 컨설팅은</span>
            <span className="block">기존의 학습 상담과 다릅니다</span>
          </h2>

          <Image
            src="/images/consultant3.png"
            alt="1:1 심층 학습 컨설팅 안내"
            width={1920}
            height={1080}
            className="motion-rise motion-delay-1 -mt-px mx-auto h-auto w-full max-w-6xl md:-mt-1"
            priority
          />

          <div className="motion-rise motion-delay-2">
            <DeepConsultingBooklet />
          </div>
        </div>
      </section>
    </main>
  );
}
