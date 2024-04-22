import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DomainModule } from './domain/domain.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/petsystem'),
    DomainModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
