export interface IRoom {
    id?: number;
    branch_id: number;
    name: string;
    description: string;
    type: number;
    price: number;
    status: number;
    rate_count: number;
    average_rate: number;
    address: string;
    is_popular: number;
    total_reviews: number;
    people_number: number;
    bed_number: number;
    is_have_wifi: number;
    is_have_parking: number;
    createdAt?: Date;
    updatedAt?: Date;
}
