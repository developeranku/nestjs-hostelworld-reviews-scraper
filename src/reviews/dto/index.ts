import {
  IsDateString,
  IsInt,
  IsOptional,
  Matches,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ReviewsQueryDto {
  @IsString()
  @Matches(
    /^https:\/\/www\.hostelworld\.com\/pwa\/wds\/hosteldetails\.php\/[\w-]+\/[\w-]+\/\d+/,
  )
  url: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  maxResults?: number;
}
