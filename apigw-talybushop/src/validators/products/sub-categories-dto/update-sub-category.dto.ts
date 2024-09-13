import { PartialType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-sub-category.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateSubCategoryDto extends PartialType(CreateSubCategoryDto) {

    @IsNumber()
    @IsPositive()
    public id: number;

}
