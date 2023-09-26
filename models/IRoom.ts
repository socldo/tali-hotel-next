export interface IRoom {
    id?: number;
    hotel_id: number;
    name: string;
    description: string;
    bed_number: number;
    people_number: number;
    size: string;
    images: string;
    type: number;
    price: number;
    status: number;
    address: string;
    is_popular: number;
    total_reviews: number;
    quantity: number;
    average_rate: number;
    createdAt?: Date;
    updatedAt?: Date;
    lat: string;
    lng: string;
    is_favorite: boolean;

}
