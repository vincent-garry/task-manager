import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  async getDashboardStats(@Request() req) {
    console.log('Requête stats reçue, userId:', req.user.userId);
    const stats = await this.analyticsService.getDashboardStats(req.user.userId);
    console.log('Stats calculées:', stats);
    return stats;
  }
  
  @Get('trends')
  async getTrendsData(@Request() req, @Query('days') days: number) {
    return await this.analyticsService.getProductivityTrends(req.user.userId, days);
  }
}