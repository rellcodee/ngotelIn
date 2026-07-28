import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ResourcesModule } from './resources/resources.module';
import { ScheduleModule } from './schedule/schedule.module';
import { RoomImagesModule } from './room_images/room_images.module';
import { BookingsModule } from './bookings/bookings.module';
import { AiBotModule } from './ai_bot/ai_bot.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UserModule,
    AuthModule,
    ResourcesModule,
    ScheduleModule,
    RoomImagesModule,
    BookingsModule,
    AiBotModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
