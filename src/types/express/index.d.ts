import { IJwtPayload } from '../auth/interfaces/jwt-payload.interface';

declare global {
  namespace Express {
    interface Request {
      user: IJwtPayload;
    }
  }
}