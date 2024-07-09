import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema()
export class Pet {
  @Prop({ required: true })
  petName: string;

  @Prop({ required: true })
  petType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: '' })
  imageURL: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
