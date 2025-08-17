import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import type { Product } from '../../types';
import { URL } from '../../types/constants';
import Paginado from '../Paginado/Paginado';
import SideBar from '../SideBar/SideBar';
import Styles from './Shop.module.css';
import Products from '../Products/Products';
import { FiFilter } from 'react-icons/fi';

const Shop: React.FC = () => {
    const location = useLocation();
    const [items, setItems] = useState<Product[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const requestedPage = parseInt(params.get('page') || '1');
        const pageToSend = (isNaN(requestedPage) || requestedPage < 1) ? 1 : requestedPage;

        params.set('page', pageToSend.toString());

        axios.get(`${URL}product?${params.toString()}`)
            .then(({ data }) => {
                setItems(data.products);
                setCurrentPage(data.actualPage);
                setTotalPages(data.totalPages);
            })
            .catch((err) => {
                console.error(err);
                console.log('error al cargar productos filtrados: ', err.message);
            });
    }, [location.search]);

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={Styles.shopPageWrapper}>
            <div className={Styles.contentCenteringContainer}>
                <button
                    onClick={handleToggleSidebar}
                    className={Styles.filterButton}
                >
                    <FiFilter /> Filtros
                </button>
                <div className={`${Styles.generalContainer} ${isSidebarOpen ? Styles.sidebarOpen : ''}`}>
                    <SideBar />
                    <div className={Styles.productsAndHighlightContainer}>
                        {items.length > 0 && <Products items={items} />}
                        {items.length === 0 && <div className={Styles.gridWrapper}>Sin coincidencias</div>}
                    </div>
                </div>
                <Paginado totalPages={totalPages} currentPage={currentPage} />
            </div>
        </div>
    );
}

export default Shop;