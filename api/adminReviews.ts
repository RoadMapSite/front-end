import { apiGet } from "@/api/apiClient";

export interface AdminReviewListItem {
  reviewId: number;
  title: string;
  authorName: string;
  createdAt: string;
  isApproved: boolean;
  isBest: boolean;
}

export interface AdminReviewsResponse {
  currentPage: number;
  totalPages: number;
  totalElements: number;
  reviews: AdminReviewListItem[];
}

/**
 * GET /v1/admin/reviews?page={page}
 */
export async function fetchAdminReviews(
  page: number
): Promise<AdminReviewsResponse> {
  const qs = new URLSearchParams();
  qs.set("page", String(page));
  return apiGet<AdminReviewsResponse>(`/v1/admin/reviews?${qs.toString()}`, {
    useRelativePath: true,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
