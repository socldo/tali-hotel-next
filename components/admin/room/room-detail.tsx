import { Model } from "../../../interface";

interface Props {

    room: Model.Room | null;
}

const RoomDetail: React.FC<Props> = ({
    room
}) => {

    const priceBodyTemplate = (value: number) => {
        const formatter = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        });
        return (
            <span>
                {formatter.format(value)}
            </span>

        );
    };
    const statusBodyTemplate = (rowData: Model.Room) => {

        return <span className={`status-badge status-${rowData.status ? 'active' : 'unactive'}`}>{(rowData.status) ? 'Đang hoạt động' : 'Tạm ngưng'}</span>;

    };


    if (!room) {
        return null;
    }

    return (
        <>
            <div className="card p-fluid" >
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>

                    <div style={{ float: 'left', width: '50%' }}>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Tên phòng: </label>
                            <span>{room?.name}</span>
                        </div>



                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Tên khách sạn: </label>
                            <span>{room?.hotel_name}</span>
                        </div>



                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Trạng thái: </label>
                            {statusBodyTemplate(room)}
                        </div>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Kích thước: </label>
                            <span>{room?.size}</span>
                        </div>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Ngày tạo: </label>
                            <span>{room?.created_at}</span>
                        </div>

                    </div>

                    <div style={{ float: 'left', width: '50%' }}>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Giá tiền: </label>
                            {priceBodyTemplate(room.price)}
                        </div>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Tên khu vực: </label>
                            <span>{room?.branch_name}</span>
                        </div>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Số giường: </label>
                            <span>{room?.bed_number}</span>

                        </div>
                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Số người: </label>
                            <span>{room?.people_number}</span>
                        </div>

                        <div className="field">
                            <label style={{ fontWeight: 'bold' }}>Số lượng: </label>
                            <span>{room?.quantity}</span>
                        </div>

                    </div>
                </div>

            </div>
            <div className="card p-fluid" >
                <div className="field">
                    <label style={{ fontWeight: 'bold' }}>Mô tả: </label>
                    <span>{room?.description}</span>
                </div>
            </div>
        </>
    )

}
export default RoomDetail;