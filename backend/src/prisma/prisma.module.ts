import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // decorator ini biar PrismaService bisa lsg dipakai di modul mana aja tanpa re-import
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }