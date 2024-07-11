import 'dotenv/config';
import { randomBytes } from 'crypto';
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';


let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== 'production') {
  sessionSecret = randomBytes(32).toString('hex');
}

if (!sessionSecret) {
  throw new Error('SESSION_SECRET environment variable is not set');
}

const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  sessionData: 'id name email createdAt',
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'email', 'password'],
  },
  passwordResetLink: {
    async sendToken(args) {
      console.log(args);
    }
  }
});

const sessionMaxAge = 60 * 60 * 24 * 30;

const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret,
});

export { withAuth, session };
