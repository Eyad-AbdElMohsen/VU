import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class ApplyForJobInput {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  cvUrl: string;
}
