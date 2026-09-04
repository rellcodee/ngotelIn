import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BookingStatus, Role } from 'src/common/enums';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class ReviewsService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  async create(createReviewDto: CreateReviewDto, currentUser: any) {
    const { booking_id, rating, comment } = createReviewDto;

    const booking = await this.prisma.bookings.findUnique({
      where: { id: booking_id },
      include: {
        schedules: {
          select: { resource_id: true },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Data booking tidak ditemukan!');
    }

    const currentUserId = currentUser.userId || currentUser.id;
    if (booking.user_id !== currentUserId) {
      throw new ForbiddenException(
        'Akses ditolak! Anda tidak bisa memberi ulasan untuk booking milik orang lain.',
      );
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException(
        `Gagal memberikan ulasan. Status booking saat ini '${booking.status}'. Ulasan hanya bisa diberikan jika status booking sudah COMPLETED!`,
      );
    }

    try {
      const review = await this.prisma.reviews.create({
        data: {
          booking_id,
          rating,
          comment,
        },
        include: {
          bookings: {
            select: {
              users: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      const resourceId = booking.schedules?.resource_id;
      if (resourceId) {
        await this.cacheManager.del(`reviews:resource:${resourceId}`);
      }

      return {
        message: 'Ulasan berhasil ditambahkan!',
        data: review,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'Anda sudah memberikan ulasan untuk booking ini!',
        );
      }
      throw new InternalServerErrorException(
        'Terjadi kesalahan internal pada server',
      );
    }
  }

  async findByResource(resourceId: string) {
    const cacheKey = `reviews:resource:${resourceId}`;
    const cachedReviews = await this.cacheManager.get(cacheKey);
    if (cachedReviews) {
      return cachedReviews;
    }

    const resourceExists = await this.prisma.resources.findUnique({
      where: { id: resourceId },
    });

    if (!resourceExists) {
      throw new NotFoundException('Resource/Kamar tidak ditemukan!');
    }

    const reviews = await this.prisma.reviews.findMany({
      where: {
        bookings: {
          schedules: {
            resource_id: resourceId,
          },
        },
      },
      include: {
        bookings: {
          select: {
            created_at: true,
            users: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: 'desc',
      },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number(
          (
            reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
            totalReviews
          ).toFixed(1),
        )
        : 0;

    const formattedResponse = {
      resource_id: resourceId,
      total_reviews: totalReviews,
      average_rating: averageRating,
      reviews: reviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        reviewer_name: r.bookings?.users?.name || 'Anonim',
        created_at: r.bookings?.created_at,
      })),
    };

    await this.cacheManager.set(cacheKey, formattedResponse, 1800000);

    return formattedResponse;
  }

  async findOne(id: string) {
    const review = await this.prisma.reviews.findUnique({
      where: { id },
      include: {
        bookings: {
          include: {
            users: true,
          },
        },
      },
    });

    if (!review) throw new NotFoundException('Ulasan tidak ditemukan!');
    return review;
  }

  async remove(id: string, currentUser: any) {
    const review = await this.prisma.reviews.findUnique({
      where: { id },
      include: {
        bookings: {
          select: {
            user_id: true,
            schedules: {
              select: { resource_id: true },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Ulasan tidak ditemukan!');
    }

    const currentUserId = currentUser.userId || currentUser.id;
    const isOwner = review.bookings?.user_id === currentUserId;
    const isAdmin = currentUser.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Akses dilarang! Anda tidak berhak menghapus ulasan ini.',
      );
    }

    try {
      await this.prisma.reviews.delete({ where: { id } });

      const resourceId = review.bookings?.schedules?.resource_id;
      if (resourceId) {
        await this.cacheManager.del(`reviews:resource:${resourceId}`);
      }

      return { message: 'Ulasan berhasil dihapus' };
    } catch (error) {
      throw new InternalServerErrorException('Gagal menghapus ulasan');
    }
  }
}