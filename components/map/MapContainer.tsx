import { mapboxAccessToken } from '../../utils/config'
import Map, { GeolocateControl, Marker, Popup } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useAppSelector } from '../../store/hooks'
import { useState } from 'react'
import { IHotel } from '../../models'
import Image from 'next/image'
import { useRouter } from 'next/router'

const MapContainer = ({ hotel }: { hotel: IHotel }) => {
    const router = useRouter()
    const { hotels } = useAppSelector((state) => state.persistedReducer.hotel)

    const [popupInfo, setPopupInfo] = useState<IHotel | null>(null)

    return (
        <>
            <Map
                initialViewState={{
                    longitude: parseFloat(hotel.lat),
                    latitude: parseFloat(hotel.lng),
                    zoom: 16
                }}
                style={{ width: 600, height: 400 }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={mapboxAccessToken}
            >
                {hotels?.map(e => <Marker
                    key={e.id}
                    longitude={parseFloat(e.lng)}
                    latitude={parseFloat(e.lat)}
                    color="red"
                    onClick={event => {
                        event.originalEvent.stopPropagation()
                        setPopupInfo(e)
                    }}
                />)}
                <Marker
                    longitude={parseFloat(hotel.lat)}
                    latitude={parseFloat(hotel.lng)}
                    color="blue"
                    onClick={event => {
                        event.originalEvent.stopPropagation()
                        setPopupInfo(hotel)
                    }}
                />
                <GeolocateControl />

                {popupInfo && (
                    <Popup
                        anchor="top"
                        longitude={parseFloat(popupInfo.lng)!}
                        latitude={parseFloat(popupInfo.lat)!}
                        onClose={() => setPopupInfo(null)}

                    >
                        <div
                            className="cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault()
                                router.push(`/hotel/${popupInfo?.id}`)
                            }
                            }>

                            <div className="font-bold">
                                {popupInfo.name}
                            </div>
                            <Image src={popupInfo.images[0]} alt={popupInfo.name} width={250} height={150} />
                        </div>
                    </Popup>
                )}
            </Map>
        </>
    )
}

export default MapContainer
