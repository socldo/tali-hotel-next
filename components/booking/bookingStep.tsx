import { Steps } from "primereact/steps";
import { MenuItem } from "primereact/menuitem";

const Booking = () => {
    const items: MenuItem[] = [
        {
            label: "Bạn chọn",
        },
        {
            label: "Chi tiết về bạn",
        },
        {
            label: "Bước cuối cùng",
        }
    ];
    return (
        <div>
            <Steps model={items} />
        </div>
    );
};

export default Booking;
