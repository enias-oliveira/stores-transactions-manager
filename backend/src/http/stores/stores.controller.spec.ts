import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from '../../services/transactions/transactions.service';
import { DatabaseModule } from '../../database/database.module';
import { StoresService } from '../../services/stores/stores.service';
import { StoresController } from './stores.controller';
import { PrismaService } from '../../database/prisma/prisma.service';
import { prismaMock } from '../../../test/singleton';
import { plainToClass, plainToInstance } from 'class-transformer';
import { StoreEntity } from './store-entity';

describe('StoresController', () => {
  let controller: StoresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [StoresController],
      providers: [StoresService, TransactionsService],
    }).overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    controller = module.get<StoresController>(StoresController);
  });

  it('should return a array of stores', async () => {
    const expected = [
      {
        "id": 1,
        "createdAt": new Date(),
        "name": "BAR DO JOÃO",
        "owner": "JOÃO MACEDO",
        "totalBalance": 0
      },
      {
        "id": 2,
        "createdAt": new Date(),
        "name": "LOJA DO Ó - MATRIZ",
        "owner": "MARIA JOSEFINA",
        "totalBalance": 0
      },
      {
        "id": 3,
        "createdAt": new Date(),
        "name": "MERCADO DA AVENIDA",
        "owner": "MARCOS PEREIRA",
        "totalBalance": 0
      },
      {
        "id": 4,
        "createdAt": new Date(),
        "name": "MERCEARIA 3 IRMÃOS",
        "owner": "JOSÉ COSTA",
        "totalBalance": 0
      },
      {
        "id": 5,
        "createdAt": new Date(),
        "name": "LOJA DO Ó - FILIAL",
        "owner": "MARIA JOSEFINA",
        "totalBalance": 0
      }
    ];
    prismaMock.store.findMany.mockResolvedValue(expected)

    expect(await controller.getStores()).toStrictEqual(expected);
  });

  it('should return a stores', async () => {
    const expected = {
      "id": 1,
      "createdAt": new Date(),
      "name": "BAR DO JOÃO",
      "owner": "JOÃO MACEDO",
      "totalBalance": 0
    }

    prismaMock.store.findUnique.mockResolvedValue({
      "id": 1,
      "createdAt": new Date(),
      "name": "BAR DO JOÃO",
      "owner": "JOÃO MACEDO",
    })

    expect(await controller.getStore(1)).toStrictEqual(plainToInstance(StoreEntity, expected))
  })

});
