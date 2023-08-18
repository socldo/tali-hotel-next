import GGMap from "../../components/googlemap/GGMap";

const Contact = () => {


    return (<>
        <div className="mt-20 flex flex-rows grid-flow-col gap-16 place-content-center">
            <div>
                <div className="grid grid-cols-1 justify-items-center border-2  py-5 px-3 w-80 ">
                    <i className="pi pi-inbox text-orange-300" style={{ fontSize: '4rem' }}></i>
                    <h1 className="mt-4 font-semibold text-xl">Địa chỉ Email</h1>
                    <h1 className="mt-4 text-zinc-500">bnmtai.java@gmail.com</h1>
                    <h1 className="text-zinc-500">thuongabcd@gmail.com</h1>
                </div>
            </div>
            <div>
                <div className="grid grid-cols-1 justify-items-center border-2 py-5 px-3 w-80">
                    <i className="pi pi-phone text-orange-300" style={{ fontSize: '4rem' }}></i>
                    <h1 className="mt-4 font-semibold text-xl ">Số điện thoại</h1>
                    <h1 className="mt-4 text-zinc-500"> 0372202801</h1>
                    <h1 className="text-zinc-500">0999999999</h1>
                </div>
            </div>
            <div>
                <div className="grid grid-cols-1 justify-items-center border-2 py-5 px-3 w-80">
                    <i className="pi pi-map-marker text-orange-300" style={{ fontSize: '4rem' }}></i>
                    <h1 className="mt-4 font-semibold text-xl">Địa chỉ văn phòng</h1>
                    <h1 className="mt-4 text-zinc-500">303 Phạm Văn Đồng</h1>
                    <h1 className="text-zinc-500">Hồ Chí Minh, Việt Nam</h1>
                </div>
            </div>
        </div>
        <div className="ml-2 mr-2 mb-2 mt-2" >
            <GGMap lat="10.820503" lng='106.691711'></GGMap>
        </div>
    </>);
};
export default Contact;
