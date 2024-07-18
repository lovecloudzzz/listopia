export type GetBooksType = {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  genreIds?: number[];
  themeIds?: number[];
};
