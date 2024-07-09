import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PetRepository } from './pet.repository';
import { Pet } from './schemas/pet.schema';
import { UpdatePetDto } from './dto/update-pet.dto';
import * as AWS from 'aws-sdk';

// AWS related environment variables
const awsBucketName = process.env.AWS_BUCKET_NAME as string;
const awsBucketRegion = process.env.AWS_BUCKET_REGION as string;
const awsAccessKey = process.env.AWS_ACCESS_KEY as string;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY as string;

@Injectable()
export class PetsService {
  constructor(private readonly petRepository: PetRepository) {}

  async getPets(): Promise<Pet[]> {
    return this.petRepository.find({});
  }

  async getPetById(petId: string): Promise<any> {
    const pet = await this.petRepository.findOne({ _id: petId });

    if (!pet) {
      throw new HttpException('pet not found', HttpStatus.NOT_FOUND);
    }

    return pet;
  }

  async createPet(
    petName: string,
    petType: string,
    description: string,
    file: any
  ): Promise<Pet> {
    const checkForPet = await this.petRepository.findOne({ petName });

    if (checkForPet) {
      throw new HttpException('this pet already added', HttpStatus.FOUND);
    }

    if (file) {
      const s3 = new AWS.S3({
        accessKeyId: awsAccessKey,
        secretAccessKey: awsSecretAccessKey
      });

      const { buffer, originalname, mimetype } = file;

      const params = {
        Bucket: awsBucketName,
        Key: originalname,
        Body: buffer,
        ACL: 'public-read',
        ContentType: mimetype,
        ContentDisposition: 'inline',
        CreateBucketConfiguration: {
          LocationConstraint: `${awsBucketRegion}`
        }
      };

      const s3Response = await s3.upload(params).promise();
      const { Location } = s3Response;

      return await this.petRepository.create({
        petName,
        petType,
        description,
        imageURL: Location
      });
    }

    const imageUrl = '';

    return await this.petRepository.create({
      petName,
      petType,
      description,
      imageURL: imageUrl
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
