export interface CreateStudioDto {
  name: string;
  description: string;
  logo: Express.Multer.File;
}
