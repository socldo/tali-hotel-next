import { useEffect, useMemo, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { Button } from 'primereact/button';

interface Props {
    latHotel: number;
    lngHotel: number;
    onMapClick: (lat: number, lng: number) => void;

    setVisibleMap: React.Dispatch<React.SetStateAction<boolean>>;
}

const HotelMap: React.FC<Props> = ({ latHotel, lngHotel, onMapClick, setVisibleMap }) => {
    const [center, setCenter] = useState({ lat: 0, lng: 0 });
    const [position, setPosition] = useState({ lat: 0, lng: 0 });


    useEffect(() => {
        setCenter({
            lat: latHotel,
            lng: lngHotel,
        });
    }, []);

    useEffect(() => {

        const distance = calculateDistance(center.lat, center.lng, position.lat, position.lng);

        const threshold = 10;
        if (distance > threshold) {
            setCenter(position);
        }
    }, [position]);

    function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const R = 6371; // Bán kính Trái Đất (đơn vị km)
        const dLat = (lat2 - lat1) * (Math.PI / 180); // Đổi vị trí từ độ sang radian
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance;
    }

    const handleMapClick = (e: any) => {
        if (e.latLng) {
            setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
            // setCenter(position);



        }
    };

    const handleOnSave = () => {
        setVisibleMap(false);
        onMapClick(position.lat, position.lng);

    }

    useEffect(() => {
        console.log({ lat: center.lat, lng: center.lng });
    });

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDxupq7h_cyTu3QkYeB8MAxWz_CePD74u4',
    });
    if (!isLoaded) {


        return (
            <>
                <div className="card">
                    <div>Loading...</div>
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="card">
                    <GoogleMap
                        onClick={handleMapClick}
                        center={{ lat: center.lat, lng: center.lng }}
                        zoom={10}
                        mapContainerStyle={{ width: '100%', height: '400px' }}
                    >
                        {position.lat !== 0 && position.lng !== 0 && <Marker position={position} />}
                    </GoogleMap>

                </div>

                <div className='button-save-cancel' style={{ textAlign: 'right' }}>
                    <Button label="Lưu" type="submit" icon="pi pi-check" style={{ marginRight: '.5em' }} onClick={() => handleOnSave()} />
                    <Button label="Hủy" severity="danger" icon="pi pi-times" onClick={() => { setVisibleMap(false) }} />
                </div>
            </>
        );
    }
};


export default HotelMap;
