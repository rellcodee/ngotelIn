import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createReviewDto: CreateReviewDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.reviewsService.create(createReviewDto, currentUser);
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

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.reviewsService.remove(id, currentUser);
  }
}