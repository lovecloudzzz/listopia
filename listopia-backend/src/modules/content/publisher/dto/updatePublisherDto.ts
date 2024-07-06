export interface UpdatePublisherDto {
  id: number;
  name?: string;
  description?: string;
  logo?: Express.Multer.File;
}
