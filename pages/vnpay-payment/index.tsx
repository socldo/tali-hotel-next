import Link from "next/link";
import { Layout } from "../../components/layout";
import Footer from "../../components/layout/Footer";
import { useRouter } from "next/router";

const VNPayPayment = () => {
    const router = useRouter();

    const query = router.query;

    return (
        <Layout
            metadata={{
                title: `Payment: Booking`,
                description: `Booking`,
            }}
        >
            {query.vnp_TransactionStatus == "00" ? (
                <div className="bg-gray-100 h-full">
                    <div className="bg-white p-6  md:mx-auto mt-16 mb-16">
                        <svg
                            viewBox="0 0 24 24"
                            className="text-green-600 w-16 h-16 mx-auto my-6"
                        >
                            <path
                                fill="currentColor"
                                d="M12,0A12,12,0,1,0,24,12,12.014,12.014,0,0,0,12,0Zm6.927,8.2-6.845,9.289a1.011,1.011,0,0,1-1.43.188L5.764,13.769a1,1,0,1,1,1.25-1.562l4.076,3.261,6.227-8.451A1,1,0,1,1,18.927,8.2Z"
                            ></path>
                        </svg>
                        <div className="text-center">
                            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                Thanh toán thành công!
                            </h3>
                            <p className="text-gray-600 my-2">
                Cảm ơn bạn vì đã tin tưởng chúng tôi
                            </p>
                            <p> Chúc bạn có một trải nghiệm tuyệt vời! </p>
                            <div className="py-10 text-center rounded-lg">
                                <Link
                                    href="/"
                                    className="rounded-lg px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
                                >
                  Về trang chủ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-100 h-full">
                    <div className="bg-white p-6  md:mx-auto mt-16 mb-16">
                        <div className="text-center">
                            <i
                                className="text-red-500 pi pi-times-circle"
                                style={{ fontSize: "4rem" }}
                            ></i>
                            <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                Giao dịch thất bại!
                            </h3>
                            <p className="text-gray-600 my-2">
                Đã xảy ra lỗi trong quá trình thanh toán
                            </p>
                            <div className="py-10 text-center rounded-lg">
                                <Link
                                    href="/"
                                    className="rounded-lg px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3"
                                >
                  Về trang chủ
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default VNPayPayment;
