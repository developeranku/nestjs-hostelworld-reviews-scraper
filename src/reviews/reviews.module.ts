import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import AuthMiddleware from '../middlewares/auth';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}
