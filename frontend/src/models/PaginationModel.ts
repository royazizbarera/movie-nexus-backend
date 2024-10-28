/**
 * Pagination model
 * @param page: number
 * @param pageSize: number
 * @param totalItems: number
 * @param totalPages: number
 * @returns {PaginationModel}
 * @example
 * {
 *  page: 1,
 *  pageSize: 10,
 *  totalItems: 100,
 *  totalPages: 10
 * }
 */

export interface PaginationModel {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
