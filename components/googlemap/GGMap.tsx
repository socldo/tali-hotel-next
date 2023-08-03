import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import React from 'react';

const containerStyle = {
    width: '100%',
    height: '400px',
};

interface Props {
    lat?: string;
    lng?: string;
    
}



const GGMap: React.FC<Props> = ({lat, lng}) => {
    console.log(lat);
    
    const center = {
        lat: parseFloat(lat ? lat : "") ,
        lng: parseFloat(lng ? lng : ''),
    };

    
    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={14}
        
        >
            <Marker position={center} />
        </GoogleMap>

    );
};

export default GGMap;
