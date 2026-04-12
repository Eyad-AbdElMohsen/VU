import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCompanyInput } from '../../auth-base/auth/inputs/register-manager.input';

export class EditCompanyInput extends PartialType(CreateCompanyInput) {
	@ApiPropertyOptional({ example: 'Acme Labs Egypt' })
	name?: string;

	@ApiPropertyOptional({ example: 'https://acme-eg.com' })
	website?: string;

	@ApiPropertyOptional({ example: '+201055566677' })
	phone?: string;

	@ApiPropertyOptional({
		example: 'https://cdn.example.com/logos/acme-new.png',
	})
	logoUrl?: string;

	@ApiPropertyOptional({
		example: 'Expanded AI recruitment platform in MENA region.',
	})
	description?: string;
}
