import { HttpStatus } from '@nestjs/common';
import { HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Promise as BBPromise } from 'bluebird';

import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async stores(params?: {
    skip?: number;
    take?: number;
    cursor?: Prisma.StoreWhereUniqueInput;
    where?: Prisma.StoreWhereInput;
    orderBy?: Prisma.StoreOrderByWithRelationInput;
  }) {
    const stores = await this.prisma.store.findMany(params);
    return BBPromise.mapSeries(stores, async (store) => ({
      ...store,
      totalBalance: await this.storeTransactionsSum(store.id),
    }));
  }

  async store(params: Prisma.StoreWhereUniqueInput) {
    const store = await this.prisma.store.findUnique({ where: params });

    if (!store) {
      throw new HttpException('Store not Found', HttpStatus.NOT_FOUND)
    }

    const totalBalance = await this.storeTransactionsSum(store.id);

    return { ...store, totalBalance };
  }

  async storeTransactionsSum(id: number) {
    const aggregate = await this.prisma.transaction.aggregate({
      where: { storeId: id },
      _sum: { value: true },
    });
    return aggregate?._sum.value ?? 0;
  }
}
