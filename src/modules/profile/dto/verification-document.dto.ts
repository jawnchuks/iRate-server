import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEnum, IsUrl, IsDateString, IsOptional } from 'class-validator';

export enum VerificationDocumentType {
  ID_CARD = 'ID_CARD',
  PASSPORT = 'PASSPORT',
  DRIVERS_LICENSE = 'DRIVERS_LICENSE',
  RESIDENCE_PERMIT = 'RESIDENCE_PERMIT',
}

export class VerificationDocumentDto {
  @ApiProperty({ description: 'Type of verification document', enum: VerificationDocumentType })
  @IsEnum(VerificationDocumentType)
  type!: VerificationDocumentType;

  @ApiProperty({ description: 'Document number or identifier' })
  @IsString()
  documentNumber!: string;

  @ApiProperty({ description: 'Country where the document was issued' })
  @IsString()
  countryOfIssue!: string;

  @ApiProperty({ description: 'Document expiry date' })
  @IsDateString()
  expiryDate!: string;

  @ApiProperty({ description: 'URL to the document image' })
  @IsUrl()
  documentUrl!: string;

  @ApiProperty({ description: 'URL to the selfie with document' })
  @IsUrl()
  selfieUrl!: string;

  @ApiProperty({ description: 'Additional metadata for verification', required: false })
  @IsOptional()
  @IsString()
  metadata?: string;
}
