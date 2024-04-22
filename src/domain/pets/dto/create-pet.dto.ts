import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePetDto {
  @IsNotEmpty({ message: 'please provide pet name' })
  @IsString({ message: 'pet name must be string' })
  petName: string;

  @IsNotEmpty({ message: 'please pet type provide pet name' })
  @IsString({ message: 'pet type must be string' })
  petType: string;

  @IsNotEmpty({ message: 'please provide details of the pet' })
  @IsString({ message: 'pet details must be in string' })
  description: string;
}
