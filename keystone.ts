import 'dotenv/config';
import { config } from '@keystone-6/core';
import { withAuth, session } from './auth';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { CartItem } from './schemas/CartItem';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const databaseUrl = process.env.DATABASE_URL;

export default withAuth(
  config({
    db: {
      provider: 'postgresql',
      url: databaseUrl,
      enableLogging: true,
      idField: { kind: 'uuid' },
    },
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    lists: {
      // Schema items go here
      User,
      Product,
      ProductImage,
      CartItem,
    },
    session,
    ui: {
      isAccessAllowed: (context) => !!context.session?.data,
    },
  })
);

