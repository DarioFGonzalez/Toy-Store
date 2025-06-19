import SideBar from '../SideBar/SideBar';
import Styles from './Shop.module.css';
import Highlight from '../Highlight/Highlight';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../../types/constants';
import type { Product } from '../../types';

const Shop: React.FC = () =>
{
    const location = useLocation();
    const [ items, setItems ] = useState<Product[]>([]);

    useEffect( () =>
    {
        if(location.search==='')
        {
            axios.get(`${URL}product`)
            .then( ( { data } ) => setItems( data ) )
            .catch( ( err ) =>
            {
                console.error( err );
                console.log( 'error al cargar productos: ', err.message )
            } );
        }
        else
        {
            setItems([]);
            console.log(`Location search: ${location.search}`);
        }
    }, [location.search]);

    return(
        <div className={Styles.generalContainer}>
            <SideBar />
            {items.length>0 && <Highlight items={items} />}
            {items.length==0 && <div className={Styles.gridWrapper}> Sin coincidencias </div>}
        </div>
    )
}

export default Shop;