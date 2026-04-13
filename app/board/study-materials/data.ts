export type StudyMaterial = {
  id: number;
  title: string;
  downloadUrl: string;
  downloadCount: number;
};

export const studyMaterials: StudyMaterial[] = [
  {
    id: 1,
    title: "수시 컨설팅 안내서",
    downloadUrl: "/files/study-materials/수시-컨설팅-안내서.pdf",
    downloadCount: 0,
  },
  {
    id: 2,
    title: "수시 컨설팅 예시 자료",
    downloadUrl: "/files/study-materials/수시-컨설팅-예시-자료.pdf",
    downloadCount: 0,
  },
  {
    id: 3,
    title: "수능 국어 공부 방법",
    downloadUrl: "/files/study-materials/수능-국어-공부방법.pdf",
    downloadCount: 156,
  },
  {
    id: 4,
    title: "수능 수학 공부 방법",
    downloadUrl: "/files/study-materials/수능-수학-공부방법.pdf",
    downloadCount: 89,
  },
  {
    id: 5,
    title: "수능 사회문화 공부 방법",
    downloadUrl: "/files/study-materials/수능-사회문화-공부방법.pdf",
    downloadCount: 203,
  },
];
