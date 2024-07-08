import { Controller, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { extractPropertyIdFromUrl } from '../utils';
import { ReviewsQueryDto } from './dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  async findReviews(@Query() reviewsQuery: ReviewsQueryDto) {
    const { url, endDate, maxResults } = reviewsQuery;
    const propertyId = extractPropertyIdFromUrl(url);
    const result = await this.reviewsService.scrapeReviews({
      propertyId,
      ...(endDate && { endDate }),
      ...(maxResults && { maxResults: maxResults.toString() }),
    });
    return result;
  }
}
