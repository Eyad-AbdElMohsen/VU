import { IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class PaginatorInput {
  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Current page number (1-based)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    minimum: 1,
    description: 'Maximum number of items to return',
  })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  limit?: number = 10;
}

export class PaginateInput {
  @ApiPropertyOptional({
    type: () => PaginatorInput,
    description: 'Pagination options',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaginatorInput)
  paginate?: PaginatorInput;
}
