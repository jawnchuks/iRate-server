import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class Education {
  @ApiProperty({ description: 'Institution name', required: false })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  institution?: string;

  @ApiProperty({ description: 'Degree or qualification', required: false })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  degree?: string;

  @ApiProperty({ description: 'Field of study', required: false })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  field?: string;

  @ApiProperty({ description: 'Year of completion', required: false })
  @IsString()
  @IsOptional()
  @Length(4, 4)
  year?: string;
}

export class WorkExperience {
  @ApiProperty({ description: 'Company name', required: false })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  company?: string;

  @ApiProperty({ description: 'Job title', required: false })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  title?: string;

  @ApiProperty({ description: 'Duration of employment', required: false })
  @IsString()
  @IsOptional()
  @Length(2, 50)
  duration?: string;

  @ApiProperty({ description: 'Job description', required: false })
  @IsString()
  @IsOptional()
  @Length(0, 500)
  description?: string;
}

export class UpdateProfessionalInfoDto {
  @ApiProperty({ description: "User's profession", required: false })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  profession?: string;

  @ApiProperty({
    description: "User's education history",
    type: [Education],
    required: false,
  })
  @IsArray()
  @Type(() => Education)
  @IsOptional()
  education?: Education[];

  @ApiProperty({
    description: "User's work experience",
    type: [WorkExperience],
    required: false,
  })
  @IsArray()
  @Type(() => WorkExperience)
  @IsOptional()
  workExperience?: WorkExperience[];

  @ApiProperty({
    description: "User's skills",
    type: [String],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];
}
