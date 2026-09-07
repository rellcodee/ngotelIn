import {
  Injectable,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BookingStatus, Role } from 'src/common/enums';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, currentUser: any) {
    const { booking_id, rating, comment } = createReviewDto;

    const booking = await this.prisma.bookings.findUnique({
      where: { id: booking_id },
    });

    if (!booking) {
      throw new NotFoundException('Data booking tidak ditemukan!');
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException(
        `Gagal memberikan ulasan. Status booking saat ini '${booking.status}'. Ulasan hanya bisa diberikan jika booking sudah selesai (COMPLETED)!`,
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

  // 2. AMBIL SEMUA REVIEW BERDASARKAN RESOURCE/KAMAR ID (Untuk Detail Kamar)
  async findByResource(resourceId: string) {
    const resourceExists = await this.prisma.resources.findUnique({
      where: { id: resourceId },
    });

    if (!resourceExists) {
      throw new NotFoundException('Resource/Kamar tidak ditemukan!');
    }

    // Query ulasan lewat relasi bertingkat
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

    // Hitung total ulasan & rata-rata rating
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

    return {
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
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException('Ulasan tidak ditemukan!');
    }

    // CEK HAK AKSES: Pemilik ulasan (lewat booking.user_id) ATAU Admin
    const isOwner = review.bookings?.user_id === currentUser.id;
    const isAdmin = currentUser.role === Role.ADMIN;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException(
        'Akses dilarang! Anda tidak berhak menghapus ulasan ini.',
      );
    }

    try {
      await this.prisma.reviews.delete({ where: { id } });
      return { message: 'Ulasan berhasil dihapus' };
    } catch (error) {
      throw new InternalServerErrorException('Gagal menghapus ulasan');
    }
  }
}
