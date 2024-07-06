export interface UpdateStudioDto {
  id: number;
  name?: string;
  description?: string;
  logo?: Express.Multer.File;
}
