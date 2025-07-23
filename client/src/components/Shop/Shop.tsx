import SideBar from '../SideBar/SideBar';
import Paginado from '../Paginado/Paginado';
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
    const [ currentPage, setCurrentPage ] = useState<number>( 1 );
    const [ totalPages, setTotalPages ] = useState<number>( 1 );
    
    useEffect( () =>
    {
        const params = new URLSearchParams(location.search);
        const requestedPage = parseInt(params.get('page') || '1');
        const pageToSend = (isNaN(requestedPage) || requestedPage<1) ? 1 : requestedPage;

        params.set('page', pageToSend.toString());

        axios.get(`${URL}product?${params.toString()}`)
        .then( ( { data } ) =>
        {
            setItems( data.products );
            setCurrentPage( data.actualPage );
            setTotalPages( data.totalPages );
        })
        .catch( ( err ) =>
        {
            console.error( err );
            console.log( 'error al cargar productos filtrados: ', err.message );
        } )
    }, [location.search]);

    return(
        <div>
            <div className={Styles.generalContainer}>
                <SideBar />
                <div>
                    {items.length>0 && <Highlight items={items} />}
                    {items.length==0 && <div className={Styles.gridWrapper}> Sin coincidencias </div>}
                </div>
            </div>
                    <Paginado totalPages={totalPages} currentPage={currentPage} />
        </div>
    )
}

export default Shop;