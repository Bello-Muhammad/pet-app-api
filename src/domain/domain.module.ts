import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PetModule } from './pets/pet.module';
import { AuthMiddleware } from './middleware/authMiddleware';
import { PetsController } from './pets/pet.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [UsersModule, PetModule],
  providers: []
})
export class DomainModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        '/auth/register',
        '/auth/login',
        '/pets/all-pets',
        '/pets/:petId'
      )
      .forRoutes(UsersController, PetsController);
  }
}
