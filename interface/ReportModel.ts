export namespace ReportModel {


    export interface NumberOfHotelByArea {
        id: number;
        name: string;
        hotel_quantity: number;
    }

    export interface CustomerReview {
        id: number;
        name: string;
        quantity: number;
    }


    export interface NumberOfVisitorsAndRevenue {
        id: number;
        order_quantity: number;
        total_revenue: number;
        report_time: string;
    }


}