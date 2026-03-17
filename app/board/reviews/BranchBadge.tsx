const BRANCH_LABELS: Record<string, string> = {
  N: "N수관",
  "Hi-end": "하이엔드관",
  N수관: "N수관",
  N수생관: "N수관",
  하이엔드관: "하이엔드관",
};

export default function BranchBadge({ branch }: { branch: string }) {
  const isN = branch === "N" || branch.includes("N수생") || branch === "N수생관" || branch === "N수관";
  const isHiEnd = branch === "Hi-end" || branch.includes("하이엔드") || branch === "하이엔드관";
  const label = BRANCH_LABELS[branch] ?? branch;

  const className = isN
    ? "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-blue-400/10 text-blue-600 ring-1 ring-blue-400/15"
    : isHiEnd
      ? "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-red-400/10 text-red-600 ring-1 ring-red-400/15"
      : "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-slate-100 text-slate-600 ring-1 ring-slate-200/80";

  return <span className={className}>{label}</span>;
}
