export interface CreateFranchiseDto {
  name: string;
  description?: string;
  logo?: Express.Multer.File;
}
