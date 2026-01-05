import { IsOptional, IsPositive, ValidateNested } from 'class-validator';
export class PaginatorInput {
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  limit?: number = 10;
}

export class PaginateInput {
  @IsOptional()
  @ValidateNested()
  paginate?: PaginatorInput;
}
