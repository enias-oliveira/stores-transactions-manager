import {
  EntryNature,
  PrismaClient,
  TransactionDescription
} from '.prisma/client';
import { transactionTypes } from './seed.constants';

const prisma = new PrismaClient();

async function main() {

  await Promise.all(
    transactionTypes.map(
      async ({
        id,
        description,
        entryNature,
      }) =>
        prisma.transactionType.upsert({
          where: { id },
          update: {},
          create: {
            id,
            description,
            entryNature,
          },
        }),
    ),
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
