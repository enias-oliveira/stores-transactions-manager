import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { StoresService } from '../../services/stores/stores.service';
import { TransactionsService } from '../../services/transactions/transactions.service';
import { PlainToTransactionInstanceInterceptor } from '../transactions/plain-to-transaction-instance.interceptor';
import { PlainToStoreInstanceInterceptor } from './plain-to-store-instance.interceptor';
import { StoreEntity } from './store-entity';

@Controller('stores')
export class StoresController {
  constructor(
    private readonly storesService: StoresService,
    private readonly transactionsService: TransactionsService,
  ) {}

  @Get('/')
  @UseInterceptors(PlainToStoreInstanceInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async getStores() {
    return this.storesService.stores();
  }

  @Get('/:id')
  @UseInterceptors(PlainToStoreInstanceInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async getStore(@Param('id', ParseIntPipe) id: number) {
    const store = await this.storesService.store({ id });
    return plainToInstance(StoreEntity, store);
  }

  @Get(':id/transactions')
  @UseInterceptors(PlainToTransactionInstanceInterceptor)
  @UseInterceptors(ClassSerializerInterceptor)
  async getStoreTransactions(@Param('id', ParseIntPipe) id: number) {
    return this.transactionsService.transactions({ where: { storeId: id } });
  }
}
