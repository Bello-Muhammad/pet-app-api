import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { PetsService } from './pet.service';
import { Pet } from './schemas/pet.schema';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { ApiResponseHandler } from '../responseHandler/petResponse.handler';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get('all-pets')
  async getPets(): Promise<Pet[]> {
    try {
      const pets = await this.petsService.getPets();
      return ApiResponseHandler.successResponse(200, 'available pets', pets);
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
  }

  @Get(':petId')
  async getPet(@Param('petId') petId: string): Promise<Pet> {
    try {
      const pet = await this.petsService.getPetById(petId);

      return ApiResponseHandler.successResponse(200, 'pet details', pet);
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
  }

  @Post('create-pet')
  @UseInterceptors(FileInterceptor('image'))
  async createPet(
    @Body() createPetDto: CreatePetDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<Pet> {
    try {
      const newPet = await this.petsService.createPet(
        createPetDto.petName,
        createPetDto.petType,
        createPetDto.description,
        file
      );

      return ApiResponseHandler.successResponse(
        201,
        'new pet added successfully',
        newPet
      );
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
  }

  @Patch('update-pet/:petId')
  async updatePet(
    @Param('petId') petId: string,
    @Body() updatePetDto: UpdatePetDto
  ): Promise<Pet> {
    try {
      const modifiedPet = await this.petsService.updatePet(petId, updatePetDto);

      return ApiResponseHandler.successResponse(
        201,
        'pet details updated',
        modifiedPet
      );
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
  }

  @Delete('remove-pet/:petId')
  async deletePet(@Param('petId') petId: string): Promise<Pet> {
    try {
      const removedPet = await this.petsService.deletePet(petId);

      return ApiResponseHandler.successResponse(
        200,
        'pet deleted successfully',
        removedPet
      );
    } catch (error) {
      if (error instanceof Error) {
        return ApiResponseHandler.failedResponse(
          500,
          'request handle failed',
          error.message
        );
      } else {
        return ApiResponseHandler.failedResponse(
          500,
          'server error try again later',
          error as string
        );
      }
    }
  }
}
