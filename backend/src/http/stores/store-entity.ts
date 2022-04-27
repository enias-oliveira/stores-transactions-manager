import { Transform } from 'class-transformer';
import { roundToTwo } from '../transactions/transaction-entity';

export class StoreEntity {
  id: number;
  createdAt: Date;

  name: string;
  owner: string;

  @Transform(({ value }) => roundToTwo(value / 100))
  totalBalance: number;
}
