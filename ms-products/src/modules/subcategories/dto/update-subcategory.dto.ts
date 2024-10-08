import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoryDto } from './create-subcategory.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateSubcategoryDto extends PartialType(CreateSubcategoryDto) {

    @IsNumber()
    @IsPositive()
    public id: number;

}
