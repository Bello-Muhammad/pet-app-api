import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet, PetSchema } from './schemas/pet.schema';
import { PetsController } from './pet.controller';
import { PetsService } from './pet.service';
import { PetRepository } from './pet.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }])],
  controllers: [PetsController],
  providers: [PetsService, PetRepository]
})
export class PetModule {}
