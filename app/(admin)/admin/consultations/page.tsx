import { Calendar } from "lucide-react";

export default function ConsultationsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-500">
          <Calendar className="h-5 w-5" strokeWidth={2} aria-hidden />
        </div>
        <h1 className="text-2xl font-bold text-slate-800">상담 일정 조회</h1>
      </div>
      <p className="mt-2 text-slate-600">(추후 구현 예정)</p>
    </div>
  );
}
