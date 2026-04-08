import { apiDelete, apiGet, apiPatch } from "@/api/apiClient";

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
  age: number;
  phoneNumber: string;
  /** 기존 재원생 여부 (미제공 시 undefined) */
  isExisting?: boolean;
  status: WaitlistStatus;
  registeredAt: string;
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
  return apiGet<WaitlistsResponse>(`/v1/admin/waitlists?${qs}`, {
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
