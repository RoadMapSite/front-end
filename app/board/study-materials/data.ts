export type StudyMaterial = {
  id: number;
  title: string;
  downloadUrl: string;
  downloadCount: number;
};

export const studyMaterials: StudyMaterial[] = [
  {
    id: 1,
    title: "수능 국어 공부 방법",
    downloadUrl: "/files/study-materials/수능-국어-공부방법.pdf",
    downloadCount: 156,
  },
  {
    id: 2,
    title: "수능 수학 공부 방법",
    downloadUrl: "/files/study-materials/수능-수학-공부방법.pdf",
    downloadCount: 89,
  },
  {
    id: 3,
    title: "수능 사회문화 공부 방법",
    downloadUrl: "/files/study-materials/수능-사회문화-공부방법.pdf",
    downloadCount: 203,
  },
];
