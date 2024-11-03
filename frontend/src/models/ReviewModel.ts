

export interface ReviewModel {
  id: number;
  userId?: number;
  movieId: number;
  content: string;
  rating: number;
  approvalStatus?: boolean;
  // email: string;
}

export interface ReviewModelTable {
  id: number;
  content: string;
  rating: number;
  movieId: number;
  userId?: number;
  // email: string;
  approvalStatus?: boolean;
}

export interface ReviewParamsModel {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  movieId?: number;
}

export function convertReviewModelToTable(review: ReviewModel): ReviewModelTable {
  return {
    id: review.id,
    content: review.content,
    rating: Number(review.rating),
    movieId: review.movieId,
    userId: review.userId || 0,
    // email: review.email,
    approvalStatus: review.approvalStatus || false,
  };
}

export function convertReviewTableToModel(review: ReviewModelTable): ReviewModel {
  return {
    id: review.id,
    content: review.content,
    rating: Number(review.rating),
    movieId: review.movieId,
    userId: review.userId,
    // email: review.email,
    approvalStatus: review.approvalStatus || false,
  };
}