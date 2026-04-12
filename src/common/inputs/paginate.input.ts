import { IsOptional, IsPositive, ValidateNested } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class PaginatorInput {
  @ApiPropertyOptional({
    example: 1,
    minimum: 1,
    description: 'Current page number (1-based)',
  })
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @ApiPropertyOptional({
    example: 10,
    minimum: 1,
    description: 'Maximum number of items to return',
  })
  @IsOptional()
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
  paginate?: PaginatorInput;
}
