import { useState } from 'react';
import { GoogleMap, LoadScript, Marker, useJsApiLoader } from '@react-google-maps/api';

const HotelMap = () => {
    const [position, setPosition] = useState({ lat: 0, lng: 0 });

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyDxupq7h_cyTu3QkYeB8MAxWz_CePD74u4',
    });

    const handleMapClick = (e: any) => {
        setPosition({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    };

    return (
        <>
            {
                <LoadScript googleMapsApiKey={'AIzaSyDxupq7h_cyTu3QkYeB8MAxWz_CePD74u4'}>

                    <GoogleMap
                        onClick={handleMapClick}
                        center={{ lat: 0, lng: 0 }}
                        zoom={10}
                        mapContainerStyle={{ width: '800px', height: '600px' }}
                    >
                        {position.lat !== 0 && position.lng !== 0 && <Marker position={position} />}
                    </GoogleMap>
                </LoadScript>



            }
        </>
    )
};

export default HotelMap;
