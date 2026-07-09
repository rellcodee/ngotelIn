import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ResourcesModule } from './resources/resources.module';

@Module({
  imports: [PrismaModule, UserModule, AuthModule, ResourcesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
