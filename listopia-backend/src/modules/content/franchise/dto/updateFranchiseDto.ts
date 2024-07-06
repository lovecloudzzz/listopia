export interface UpdateFranchiseDto {
  id: number;
  name?: string;
  description?: string;
  logo?: Express.Multer.File;
}
