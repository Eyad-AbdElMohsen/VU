import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApplyForJobInput {
  @ApiProperty({ example: 'Omar Nasser', description: 'Candidate full name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'omar.nasser@example.com',
    description: 'Candidate email address',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'https://cdn.example.com/cv/omar-nasser.pdf',
    description: 'Public URL for candidate CV file',
  })
  @IsString()
  @IsNotEmpty()
  cvUrl: string;
}
