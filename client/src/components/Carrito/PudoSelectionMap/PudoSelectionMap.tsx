import React, { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css'; 
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import styles from './PudoSelectionMap.module.css';
import axios from 'axios';
import { URL } from '../../../types/constants';
import type { mapProps } from '../../../types/index';

(L.Icon.Default.prototype as any)._getIconUrl = function () {
    return (
        L.Browser.retina
            ? this.options.iconRetinaUrl
            : this.options.iconUrl
    );
};

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

type LockerInfo =
{
    id: number,
    latitude: number,
    longitude: number,
    name: string,
    lockerAddress:
    {
        address: string,
        city: string,
        province: string,
        zipcode: string
    }
};

const MapController: React.FC<{ lockers: LockerInfo[] }> = ({ lockers }) => {
    const map = useMap(); 
    
    useEffect(() => {
        if (lockers.length === 0) {
            return;
        }

        const bounds = L.latLngBounds(
            lockers.map(l => [l.latitude, l.longitude])
        );

        map.flyToBounds(bounds, {
            padding: L.point(50, 50),
            maxZoom: 16
        });

    }, [lockers, map]);

    return null; 
};

export const PudoSelectionMap: React.FC<mapProps> = ( { setDestinationLocker } ) => {
    // const [ lockerSeleccionadoId, setLockerSeleccionadoId ] = useState<number | null>(null);
    const [ availableZones, setAvailableZones ] = useState<string[]>();
    const [ selectedZone, setSelectedZone ] = useState<string>('');
    const [ lockersData, setLockersData ] = useState<LockerInfo[]>([]);

    useEffect( () =>
    {
        axios.get(`${URL}pudo/locations`).then( res =>
        {
            setAvailableZones(res.data);
            if (res.data && res.data.length > 0) {
                 setSelectedZone(res.data[0]);
            }
        } ).catch( err => console.log( "Error con el endpoint /pudo/locations", err ) );
    }, [] );

    useEffect( () =>
    {
        if( selectedZone!=='' )
        {
            axios.get(`${URL}pudo/${selectedZone}`).then( (res) =>
            {
                setLockersData( res.data );
            }).catch( (err) => console.log( "Error trayendo los lockers de la zona ", err ) );
        }
    }, [ selectedZone ] );

    const initialCenter: [number, number] = [-34.4544, -58.5764];
    const initialZoom = 12;

    const mapCenter = lockersData.length > 0
        ? [lockersData[0].latitude, lockersData[0].longitude] as [number, number]
        : initialCenter;

    const captureLockerInfo = ( locker: any ) =>
    {
        const Address = locker.lockerAddress;
        if(!Address) throw new Error( 'No address found' );

        setDestinationLocker( ( {
                shippingMethodId: 1,
                lockerId: locker.id,
                price: '',
                destination:
                {
                    address: Address.address.trim(),
                    province: Address.province.trim(),
                    country: 'AR',
                    city: Address.city.trim(),
                    postalCode: Address.zipCode.replace(/\D/g, '')
                }
            }
        ) );
    }

    return (
        <div className={styles.lockerMapContainer}>
            <h3 className={styles.lockerMapSubtitle}>Zona: {selectedZone}</h3>
            <select className={styles.zoneSelect} onChange={(e) => setSelectedZone( e.target.value )}>
                {availableZones?.map( ( zone, index ) => (
                    <option key={index} value={zone.toLowerCase()}>{zone}</option>
                ) )}
            </select>
            {/* <h3 className={styles.lockerMapTitle}>Locker seleccionado: {lockerSeleccionadoId ? lockerSeleccionadoId : 'Ninguno'}</h3> */}
            
            <div className={styles.mapWrapper}> 
                <MapContainer 
                    center={mapCenter} 
                    zoom={initialZoom}
                    className={styles.leafletMap}
                >
                    
                    <TileLayer 
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
                    />
                    
                    <MapController lockers={lockersData} /> 

                    {lockersData.map(locker =>
                        <Marker 
                            key={locker.id} 
                            position={ [ locker.latitude, locker.longitude ] } 
                            eventHandlers={{ click: () => captureLockerInfo( locker ) }} 
                        >
                            <Popup>
                                {locker.name} <br />
                                {locker.lockerAddress.address}
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}