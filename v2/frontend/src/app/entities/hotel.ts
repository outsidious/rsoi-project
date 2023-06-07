export interface HotelI {
  id?: number;
  hotel_uid: number;
  name: string;
  country?: string;
  city?: string;
  address?: string;
  fullAddress?: string;
  stars: number;
  price?: number;
}

export interface ReservationI {
  startDate: string;
  endDate: string;
  hotel: HotelI;
  payment: { status: string; price: number };
  reservationUid: string;
  status: string;
}
