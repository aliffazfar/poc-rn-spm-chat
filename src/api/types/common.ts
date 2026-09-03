export interface PaginatedResponse<T> {
  total: number
  limit: number
  offset: number
  results: T[]
}

export interface PaginationParams {
  limit?: number
  offset?: number
  q?: string
  [key: string]: string | number | boolean | undefined
}
