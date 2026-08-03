import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  // Endpoint buat dipanggil frontend pas nemuin detail kamar: GET /reviews/resource/:resourceId
  @Get('resource/:resourceId')
  findByResource(@Param('resourceId') resourceId: string) {
    return this.reviewsService.findByResource(resourceId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}