export interface IRoom {
    _id?: number;
    branch_id: number;
    name: string;
    description: string;
    type: number;
    price: number;
    status: number;
    rate_count: number;
    average_rate: number;
    address: string;
    createdAt?: Date;
    updatedAt?: Date;
}
