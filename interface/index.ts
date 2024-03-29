export namespace Model {
    export interface Branch {
        id: number;
        name: string;
        email: string;
        address: string;
        phone: string;
        status: boolean;
        images: string;
    }


    export interface APIResponse {
        status: number;
        message: string;
        data: null | string;
    }

    export interface User {
        id: number;
        role_id: number;
        birthday: string;
        avatar: string;
        name: string;
        email: string;
        address: string;
        phone: string;
        gender: number;
        is_locked: boolean;
        created_at: string;
        updated_at: string;
    }

    export interface Hotel {
        id: number;
        branch_id: number;
        name: string;
        branch_name: string;
        email: string;
        address: string;
        phone: string;
        images: string[];
        description: string;
        status: boolean;
        is_popular: boolean;
        is_have_wifi: boolean;
        is_have_parking: boolean;
        short_description: string;
        highlight_property: string;
        type: number;
        type_name: string;
        price: number;
        created_at: string;
        updated_at: string;
        lat: number;
        lng: number;
    }

    export interface RatingRate {
        rate_count: number;
        average_rate: number;
        total_one_star: number;
        total_two_star: number;
        total_three_star: number;
        total_four_star: number;
        total_five_star: number;
    }
    export interface Room {
        id: number;
        name: string;
        hotel_id: number;
        hotel_name: string;
        branch_id: number;
        branch_name: string;
        description: string;
        status: boolean;
        bed_number: number;
        people_number: number;
        size: string;
        price: number;
        quantity: number;
        created_at: string;
        updated_at: string;
    }

    export interface Reviews {
        id: number;
        parent_review_id: number;
        hotel_id: number;
        hotel_name: string;
        user_id: number;
        user_role_id: number;
        user_name: string;
        user_avatar: string;
        user_role_name: string;
        is_deleted: number;
        content: string;
        score_rate: number;
        created_at: string;
        updated_at: string;
    }

    export interface ReviewDetail {
        id: number;
        parent_review_id: number;
        hotel_id: number;

        hotel_name: string;
        user_id: number;
        user_role_id: number;
        user_avatar: string;
        user_name: string;
        user_role_name: string;
        is_deleted: number;
        content: string;
        score_rate: number;
        created_at: string;
        updated_at: string;
        comments: Reviews[];
    }

    export interface News {
        id: number;
        user_id: number;
        user_role_id: number;
        user_name: string;
        user_avatar: string;
        content: string;
        image: string;
        summary: string;
        title: string;
        type: number;
        views: number;
        is_deleted: boolean;
        created_at: string;
        updated_at: string;
    }

    export interface Booking {
        id: number;
        user_id: number;
        hotel_id: number;
        branch_id: number;
        checkin_date: string;
        checkout_date: string;
        status: number;
        amount: number;
        total_amount: number;
        deposit_amount: number;
        payment_type: number;
        payment_status: number;
        first_name: number;
        last_name: number;
        phone: string;
        email: string;
        hotel_name: string;
        image: string;
        type: string;
        rating: number;
        created_at: string;
        updated_at: string;
    }

}