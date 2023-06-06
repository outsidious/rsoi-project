export class User {
  id: number = -1;
  email: string = '';
  roles: Role[] = [];
  fio: string = '';

  constructor(user: UserI) {
    this.id = user.id;
    this.email = user.email;
    this.roles = [...user.roles];
    this.fio = user.fio;
  }
}

export interface UserI {
  id: number;
  email: string;
  roles: Role[];
  fio: string;
}

export class Role {
  id: number = -1;
  name: string = '';
}
