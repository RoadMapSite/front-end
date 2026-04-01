/**
 * 상담 신청 달력용 날짜 규칙 (로컬 날짜 기준)
 */

export function formatDateLocal(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** 오늘 기준 이틀 뒤부터 선택 가능 (예: 월요일 → 수요일부터) */
export function getConsultationMinSelectableDateStr(): string {
  const now = new Date();
  const min = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2);
  return formatDateLocal(min);
}
