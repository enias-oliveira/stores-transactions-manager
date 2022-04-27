import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs';
import * as path from 'path';
import { transactionTypes } from '../../../prisma/seed.constants';
import { prismaMock } from '../../../test/singleton';
import { DatabaseModule } from '../../database/database.module';
import { PrismaService } from '../../database/prisma/prisma.service';
import { TransactionsService } from '../../services/transactions/transactions.service';
import { TransactionsController } from './transactions.controller';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      controllers: [TransactionsController],
      providers: [TransactionsService],
    }).overrideProvider(PrismaService)
      .useValue(prismaMock)
      .compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('should return an array of transactions types', async () => {
    prismaMock.transactionType.findMany.mockResolvedValue(transactionTypes)

    expect(await controller.getTransactionsTypes()).toBe(transactionTypes);
  });

  it('should return an array of transactions', async () => {
    const expected = [
      {
        "id": 1,
        "transactionTypeId": 3,
        "date": new Date(),
        "value": 1.42,
        "CPF": "09620676017",
        "card": "4753****3153",
        "storeId": 1
      },
      {
        "id": 2,
        "transactionTypeId": 5,
        "date": new Date(),
        "value": 1.32,
        "CPF": "55641815063",
        "card": "3123****7687",
        "storeId": 2
      },
      {
        "id": 3,
        "transactionTypeId": 3,
        "date": new Date(),
        "value": 1.22,
        "CPF": "84515254073",
        "card": "6777****1313",
        "storeId": 3
      },
      {
        "id": 4,
        "transactionTypeId": 2,
        "date": new Date(),
        "value": 1.12,
        "CPF": "09620676017",
        "card": "3648****0099",
        "storeId": 1
      },
      {
        "id": 5,
        "transactionTypeId": 1,
        "date": new Date(),
        "value": 1.52,
        "CPF": "09620676017",
        "card": "1234****7890",
        "storeId": 1
      },
      {
        "id": 6,
        "transactionTypeId": 2,
        "date": new Date(),
        "value": 1.07,
        "CPF": "84515254073",
        "card": "8723****9987",
        "storeId": 3
      },
    ];
    prismaMock.transaction.findMany.mockResolvedValue(expected)

    expect(await controller.getTransactions()).toStrictEqual(expected);
  })

  it('should return an array of created transactions', async () => {
    const expectedStore = {
      "id": 1,
      "createdAt": new Date(),
      "name": "BAR DO JOÃO",
      "owner": "JOÃO MACEDO",
      "totalBalance": 0
    }

    prismaMock.store.upsert.mockResolvedValueOnce(expectedStore)

    const expected = [{
      "id": 1,
      "transactionTypeId": 3,
      "date": new Date("2019-03-01T18:34:53.000Z"),
      "value": 1.42,
      "CPF": "09620676017",
      "card": "4753****3153",
      "storeId": 1
    }];

    prismaMock.$transaction.mockResolvedValueOnce(expected)


    const CNABFileLocation = path.join(__dirname, '..', '..', '..', 'test', 'CNAB_test.txt');
    const CNABBuffer = fs.readFileSync(CNABFileLocation, 'utf8');
    const CNABFile: Express.Multer.File = {
      buffer: Buffer.from(CNABBuffer),
      fieldname: 'file',
      originalname: 'CNAB_test.txt',
      encoding: 'utf8',
      mimetype: 'text/plain',
      destination: CNABFileLocation,
      filename: 'CNAB_test.txt',
      path: CNABFileLocation,
      size: Buffer.byteLength(CNABBuffer),
      stream: fs.createReadStream(CNABFileLocation)
    }

    expect(await controller.uploadTransactionsFile(CNABFile as Express.Multer.File)).toStrictEqual(expected);
  })

});
