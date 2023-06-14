declare namespace Model {


    interface Branch {
        id: number;
        name: string;
        email: string;
        address: string;
        phone: string;
        status: boolean;
    }


    interface APIResponse {
        status: number;
        message: string;
        data: Branch[];
    }

}