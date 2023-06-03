export class Payment {
    id: number;
    payment_uid: string;
    status: 'PAID' | 'CANCELED';
    price: number;
}