
import NumberOfHotelByAreaReport from "../../components/admin/reports/number-of-hotel-by-area";
import NumberOfVisitorsAndRevenue from "../../components/admin/reports/number-of-visitors-and-revenue";

const AdminPage = () => {

    return (
        <>
            <div className="card flex justify-content-center">
                <NumberOfHotelByAreaReport></NumberOfHotelByAreaReport>
            </div>
            <div className="card">
                <NumberOfVisitorsAndRevenue />
            </div>
        </>

    )

}
export default AdminPage;