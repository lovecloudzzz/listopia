export interface CreateDeveloperDto {
  name: string;
  description?: string;
  logo?: Express.Multer.File;
}
