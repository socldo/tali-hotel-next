import { Model } from "../../../interface";

interface Props {


    currentBooking: Model.Booking | null;
    onSave: () => void;
    setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}


const BookingCreate: React.FC<Props> = ({
    onSave,
    setVisible,
    currentBooking
}) => {
    return (
        <>
            <div className="card">


            </div>
        </>


    );
}

export default BookingCreate;