import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PetRepository } from './pet.repository';
import { Pet } from './schemas/pet.schema';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly petRepository: PetRepository) {}

  async getPets(): Promise<Pet[]> {
    return this.petRepository.find({});
  }

  async getPetById(petId: string): Promise<Pet> {
    const pet = await this.petRepository.findOne({ _id: petId });

    if (!pet) {
      throw new HttpException('pet not found', HttpStatus.NOT_FOUND);
    }

    return pet;
  }

  async createPet(
    petName: string,
    petType: string,
    description: string
  ): Promise<Pet> {
    const checkForPet = await this.petRepository.findOne({ petName });

    if (checkForPet) {
      throw new HttpException('this pet already added', HttpStatus.FOUND);
    }

    return this.petRepository.create({
      petName,
      petType,
      description
    });
  }

  async updatePet(petId: string, petUpdates: UpdatePetDto): Promise<Pet> {
    const updatePet = await this.petRepository.findOneAndUpdate(
      { _id: petId },
      petUpdates
    );

    if (!updatePet) {
      throw new HttpException(
        'unable to update pet details',
        HttpStatus.NOT_MODIFIED
      );
    }

    return updatePet;
  }

  async deletePet(petId: string): Promise<Pet> {
    const isRemoved = await this.petRepository.findOneAndDelete({ _id: petId });

    if (!isRemoved) {
      throw new HttpException(
        'pet not removed',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    return isRemoved;
  }
}
