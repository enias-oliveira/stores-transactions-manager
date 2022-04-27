import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Transaction } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';
import { StoreEntity } from './store-entity';

@Injectable()
export class PlainToStoreInstanceInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        map((stores) =>
          stores.map((store: Transaction) =>
            plainToInstance(StoreEntity, store),
          ),
        ),
      );
  }
}
