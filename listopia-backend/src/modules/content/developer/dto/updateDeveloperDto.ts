export interface UpdateDeveloperDto {
  id: number;
  name?: string;
  description?: string;
  logo?: Express.Multer.File;
}
