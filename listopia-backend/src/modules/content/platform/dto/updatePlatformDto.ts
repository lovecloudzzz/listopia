export interface UpdatePlatformDto {
  id: number;
  name?: string;
  description?: string;
  logo?: Express.Multer.File;
}
