export class Reservation {
  id: number;
  reservation_uid: string;
  username: string;
  payment_uid: string;
  hotel_id: number;
  status: string;
  start_date: string;
  end_data: string;
}

export class Hotel {
  id: number;
  name: string;
  hotel_uid: string;
  country: string;
  city: string;
  address: string;
  stars: number;
  price: number;
}
