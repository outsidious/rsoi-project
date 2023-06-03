export class Loyalty {
  id: number;
  username: string;
  reservation_count: number;
  status: 'BRONZE' | 'SILVER' | 'GOLD';
  discount: number;
}
