export interface UpdateCharacterDto {
  id: number;
  name?: string;
  description?: string;
  photo?: Express.Multer.File;
}
