export interface CreateCharacterDto {
  name: string;
  description?: string;
  photo?: Express.Multer.File;
}
