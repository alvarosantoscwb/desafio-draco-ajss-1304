import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';
import { CommunicationsService } from './communications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('communications')
@UseGuards(JwtAuthGuard)
export class CommunicationsController {
  constructor(private readonly communicationsService: CommunicationsService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('dataInicio') dataInicio?: string,
    @Query('dataFim') dataFim?: string,
    @Query('tribunal') tribunal?: string,
    @Query('numeroProcesso') numeroProcesso?: string,
  ) {
    return this.communicationsService.findAll({
      page,
      limit,
      dataInicio,
      dataFim,
      tribunal,
      numeroProcesso,
    });
  }

  @Get('process/:processNumber')
  findByProcess(@Param('processNumber') processNumber: string) {
    return this.communicationsService.findByProcess(processNumber);
  }

  @Post(':id/summary')
  generateSummary(@Param('id', ParseIntPipe) id: number) {
    return this.communicationsService.generateSummary(id);
  }
}
