import { GoogleMap, LoadScript, Marker, useLoadScript } from '@react-google-maps/api';
import React from 'react';

const containerStyle = {
    width: '100%',
    height: '400px',
};

interface Props {
    lat?: string;
    lng?: string;

}



const GGMap: React.FC<Props> = ({ lat, lng }) => {
    console.log(lat);

    const center = {
        lat: parseFloat(lat ? lat : ""),
        lng: parseFloat(lng ? lng : ''),
    };
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
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={14}
            >
                <Marker position={center} />
            </GoogleMap>

        );
    }
};

export default GGMap;
