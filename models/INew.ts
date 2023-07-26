export interface INew {
    id?: number;
    user_id?: number;
    user_name: string;
    user_avatar: string;
    title: string;
    image: string;
    summary: string;
    content: string;
    type?: number;
    views?: number;
    is_deleted: number;
    created_at: Date;
    updated_at: Date;
}