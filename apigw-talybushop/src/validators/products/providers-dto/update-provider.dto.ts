import { PartialType } from '@nestjs/mapped-types';
import { CreateProviderDto } from './create-provider.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdateProviderDto extends PartialType(CreateProviderDto) {

    @IsNumber()
    @IsPositive()
    public id: number;

}
