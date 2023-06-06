export class Hotel {
  id: number = -1;
  hotel_uid: number = -1;
  name: string;
  country: string;
  city: string;
  address: string;
  stars: number;
  price: number;

  constructor(hotel: HotelI) {
    this.id = hotel.id;
    this.name = hotel.name;
    this.hotel_uid = hotel.hotel_uid;
    this.country = hotel.country;
    this.city = hotel.city;
    this.address = hotel.address;
    this.stars = hotel.stars;
    this.price = hotel.price;
  }
}

export interface HotelI {
  id: number;
  hotel_uid: number;
  name: string;
  country: string;
  city: string;
  address: string;
  stars: number;
  price: number;
}
