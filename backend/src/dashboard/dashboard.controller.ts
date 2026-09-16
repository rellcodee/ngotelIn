import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Roles(Role.ADMIN)
  @Get('admin')
  async getAdminStats() {
    return this.dashboardService.getAdminStats();
  }

  @Roles(Role.ADMIN, Role.STAFF)
  @Get('staff')
  async getStaffStats() {
    return this.dashboardService.getStaffStats();
  }
}
