import { apiDelete, apiGet, apiPatch, apiPost } from "@/api/apiClient";

export type WaitlistSeason = "SEMESTER_1" | "SEMESTER_2" | "SUMMER" | "WINTER";

export type WaitlistBranch = "N" | "Hi-end";

export type WaitlistStatus = "WAITING" | "CONTACTED" | "REGISTERED" | "CANCELED";

export type WaitlistGender = "MALE" | "FEMALE";

export interface Waitlist {
  waitlistId: number;
  waitingNumber: number;
  branch: WaitlistBranch | null;
  season: WaitlistSeason;
  name: string;
  gender?: WaitlistGender;
  /** N수관·캠프 등. 하이엔드 미수집 시 생략 가능 */
  age?: number | null;
  phoneNumber: string;
  /** 기존 재원생 여부 (미제공 시 undefined) */
  isExisting?: boolean;
  status: WaitlistStatus;
  registeredAt: string;
  /** 하이엔드·캠프 — DB `student_school` 등 */
  student_school?: string | null;
  student_grade?: string | null;
  studentSchool?: string | null;
  studentGrade?: string | null;
  school?: string | null;
  grade?: string | null;
}

function readStringField(obj: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const v = obj[key];
    if (v == null || v === "") continue;
    const s = typeof v === "string" ? v.trim() : String(v).trim();
    if (s.length > 0) return s;
  }
  return null;
}

/**
 * API가 student_school / studentSchool / school 등 여러 키로 줄 수 있어 통일.
 */
export function normalizeWaitlist(raw: Waitlist & Record<string, unknown>): Waitlist {
  const r = raw as Record<string, unknown>;
  return {
    ...raw,
    student_school: readStringField(r, ["student_school", "studentSchool", "school"]),
    student_grade: readStringField(r, ["student_grade", "studentGrade", "grade"]),
  };
}

export interface WaitlistsResponse {
  waitlists: Waitlist[];
}

export type FetchAdminWaitlistsParams = {
  season: WaitlistSeason;
  /** 학기 탭만 전달. 여름/겨울 캠프는 생략하여 쿼리에 포함하지 않음 */
  branch?: WaitlistBranch;
  /** 전체 조회 시 생략. MALE/FEMALE만 쿼리에 포함 */
  gender?: WaitlistGender;
};

/**
 * season 필수. branch는 학기 탭일 때만. gender는 MALE/FEMALE일 때만.
 */
export function buildAdminWaitlistsSearchParams(
  params: FetchAdminWaitlistsParams
): URLSearchParams {
  const search = new URLSearchParams();
  search.set("season", params.season);
  if (params.branch !== undefined) {
    search.set("branch", params.branch);
  }
  if (params.gender === "MALE" || params.gender === "FEMALE") {
    search.set("gender", params.gender);
  }
  return search;
}

export async function fetchAdminWaitlists(
  params: FetchAdminWaitlistsParams
): Promise<WaitlistsResponse> {
  const qs = buildAdminWaitlistsSearchParams(params).toString();
  const data = await apiGet<WaitlistsResponse>(`/v1/admin/waitlists?${qs}`, {
    useRelativePath: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
  const raw = data.waitlists ?? [];
  return {
    waitlists: raw.map((w) => normalizeWaitlist(w as Waitlist & Record<string, unknown>)),
  };
}

/** 탭 유형 — 사용자 대기 신청(`/v1/user/waitlists`)과 동일한 필드 규칙으로 본문 구성 */
export type AdminWaitlistCreateVariant = "n_branch" | "hi_end" | "camp";

export type AdminWaitlistCreateFormInput = {
  name: string;
  phoneNumber: string;
  /** `YYYY-MM-DD` (시간 없음) */
  registeredAt: string;
  gender: WaitlistGender;
  isExisting: boolean;
  ageInput?: string;
  school?: string;
  grade?: string;
};

/**
 * POST /v1/admin/waitlists 본문.
 * - 공통: `registeredAt` — `YYYY-MM-DD` 문자열(시간 없음).
 * - 학기 탭: `branch` 포함. 캠프: `branch` 생략.
 * - N: `age`만. 하이엔드: `school`, `grade`. 캠프: `age` + `school` + `grade`.
 */
export function buildAdminWaitlistCreateBody(
  variant: AdminWaitlistCreateVariant,
  season: WaitlistSeason,
  branch: WaitlistBranch | null,
  data: AdminWaitlistCreateFormInput
): Record<string, unknown> {
  const body: Record<string, unknown> = {
    season,
    name: data.name.trim(),
    phoneNumber: data.phoneNumber.replace(/\D/g, ""),
    registeredAt: data.registeredAt.trim(),
    gender: data.gender,
    isExisting: data.isExisting,
  };
  if (branch === "N" || branch === "Hi-end") {
    body.branch = branch;
  }

  if (variant === "n_branch") {
    const age = parseInt(data.ageInput?.trim() ?? "", 10);
    if (!Number.isNaN(age)) body.age = age;
    return body;
  }

  if (variant === "hi_end") {
    const school = data.school?.trim() ?? "";
    if (school) body.school = school;
    const grade = data.grade?.trim() ?? "";
    if (grade) body.grade = grade;
    return body;
  }

  const age = parseInt(data.ageInput?.trim() ?? "", 10);
  if (!Number.isNaN(age)) body.age = age;
  const school = data.school?.trim() ?? "";
  if (school) body.school = school;
  const grade = data.grade?.trim() ?? "";
  if (grade) body.grade = grade;
  return body;
}

export async function createAdminWaitlist(
  body: Record<string, unknown>
): Promise<unknown> {
  return apiPost("/v1/admin/waitlists", body, {
    useRelativePath: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export interface PatchWaitlistStatusResponse {
  success: boolean;
  message?: string;
}

/**
 * PATCH /v1/admin/waitlists/{waitlistId}/status
 * Body: { status: WaitlistStatus }
 */
export async function patchAdminWaitlistStatus(
  waitlistId: number,
  status: WaitlistStatus
): Promise<PatchWaitlistStatusResponse | null> {
  return apiPatch<PatchWaitlistStatusResponse | null>(
    `/v1/admin/waitlists/${waitlistId}/status`,
    { status },
    {
      useRelativePath: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export interface DeleteWaitlistResponse {
  success: boolean;
  message?: string;
}

/**
 * DELETE /v1/admin/waitlists/{waitlistId}
 */
export async function deleteAdminWaitlist(
  waitlistId: number
): Promise<DeleteWaitlistResponse | null> {
  return apiDelete<DeleteWaitlistResponse | null>(
    `/v1/admin/waitlists/${waitlistId}`,
    {
      useRelativePath: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
