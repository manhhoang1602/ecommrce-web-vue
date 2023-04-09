interface IAccount {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password?: string;
  status: 0 | 1;
  role: 0 | 1;
}

export type { IAccount };
