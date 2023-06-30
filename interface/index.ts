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
        data: Branch[];
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
        is_locked: boolean;
    }


}