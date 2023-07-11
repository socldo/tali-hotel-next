export interface Address {
    name: string;
    lat?: number;
    lng?: number;
    _id?: string;
}

export interface IHotel {
    id?: number;
    branch_id?: number;
    name: string;
    number: string;
    images: string;
    type: string;
    price?: number;
    status?: number;
    rate_count: number;
    average_rate?: number;
    is_popular?: number;
    is_have_wifi: number;
    is_have_parking?: number;
    short_description: string;
    highlight_property: string;
}
