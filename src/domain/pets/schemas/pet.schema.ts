import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PetDocument = Pet & Document;

@Schema()
export class Pet {
  @Prop()
  petName: string;

  @Prop()
  petType: string;

  @Prop()
  description: string;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
