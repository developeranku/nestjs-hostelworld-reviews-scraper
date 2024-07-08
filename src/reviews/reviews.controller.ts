import { Controller, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { extractPropertyIdFromUrl } from '../utils';
import { ReviewsQueryDto } from './dto';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Find reviews for a hostelworld property' })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for authentication',
    required: true,
    example: '',
  })
  @ApiQuery({
    name: 'url',
    required: true,
    type: String,
    description: 'URL of the property',
    example:
      'https://www.hostelworld.com/pwa/wds/hosteldetails.php/St-Christopher-s-Inn-Gare-du-Nord/Paris/72963',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: Date,
    description: 'End date for review scraping',
    example: '2024-06-01',
  })
  @ApiQuery({
    name: 'maxResults',
    required: false,
    type: Number,
    description: 'Maximum number of results to return',
    example: '50',
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved reviews' })
  @ApiResponse({ status: 400, description: 'Bad request' })
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
