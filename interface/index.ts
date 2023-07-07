declare namespace Model {


    interface Branch {
        id: number;
        name: string;
        email: string;
        address: string;
        phone: string;
        status: boolean;
        images: string;
    }


    interface APIResponse {
        status: number;
        message: string;
        data: null | string;
    }

    interface User {
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

    interface Hotel {
        id: number;
        branch_id: number;
        name: string;
        branch_name: string;
        email: string;
        address: string;
        phone: string;
        images: [string];
        description: string;
        status: boolean;
        is_popular: boolean;
        is_have_wifi: boolean;
        is_have_parking: boolean;
        short_description: string;
        higlight_property: string;
        created_at: string;
        updated_at: string;
    }
}