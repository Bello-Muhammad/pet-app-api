import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';

import { Pet, PetDocument } from './schemas/pet.schema';

@Injectable()
export class PetRepository {
  constructor(@InjectModel(Pet.name) private petModel: Model<PetDocument>) {}

  async findOne(petFilterQuery: FilterQuery<Pet>): Promise<Pet> {
    return this.petModel.findOne(petFilterQuery);
  }

  async find(petFilterQuery: FilterQuery<Pet>): Promise<Pet[]> {
    return this.petModel.find(petFilterQuery);
  }

  async create(pet: Pet): Promise<Pet> {
    const newPet = new this.petModel(pet);
    return newPet.save();
  }

  async findOneAndUpdate(
    petFilterQuery: FilterQuery<Pet>,
    pet: Partial<Pet>
  ): Promise<Pet> {
    return this.petModel.findOneAndUpdate(petFilterQuery, pet, { new: true });
  }

  async findOneAndDelete(petFilterQuery: FilterQuery<Pet>): Promise<Pet> {
    return this.petModel.findOneAndDelete(petFilterQuery);
  }
}
