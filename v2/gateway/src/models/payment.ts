export class Payment {
  payment_uid: string;
  status: 'PAID' | 'CANCELED';
  price: number;
}
