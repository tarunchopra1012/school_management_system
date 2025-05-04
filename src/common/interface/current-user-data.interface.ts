import { Role } from '../../users/entities/user.entity';

export interface CurrentUserData {
  id: number;
  email: string;
  role: Role;
}
