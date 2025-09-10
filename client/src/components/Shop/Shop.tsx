import axios from 'axios';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';
import type { Product } from '../../types';
import { URL } from '../../types/constants';
import SideBar from '../SideBar/SideBar';
import Styles from './Shop.module.css';
import sideBarStyles from '../SideBar/SideBar.module.css';
import Products from '../Products/Products';
import { FiFilter } from 'react-icons/fi';

const Shop: React.FC = () => {
    const location = useLocation();
    const [items, setItems] = useState<Product[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const isMobile = useMediaQuery({ maxWidth: 768 });

    const lastProductElementRef = useCallback((node: HTMLDivElement) => {
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [hasMore]);

    useEffect(() => {
        setItems([]);
        setPage(1);
        setHasMore(true);
    }, [location.search]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        params.set('page', page.toString());

        axios.get(`${URL}product?${params.toString()}`)
            .then(({ data }) => {
                setItems(prevItems => {
                    if (page === 1) {
                        return data.products;
                    }
                    return [...prevItems, ...data.products];
                });
                setHasMore(data.products.length > 0);
            })
            .catch((err) => {
                console.error(err);
                setHasMore(false);
            });
    }, [location.search, page]);

    const handleToggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleCloseSidebar = () => {
        setIsSidebarOpen(false);
    };

    return (
        <div className={Styles.shopPageWrapper}>
            <div className={Styles.contentCenteringContainer}>
                {/* Botón solo visible en mobile */}
                {isMobile && (
                    <button
                        onClick={handleToggleSidebar}
                        className={Styles.filterButton}
                    >
                        <FiFilter /> Filtros
                    </button>
                )}

                {/* Sidebar y backdrop en mobile */}
                {isMobile && (
                    <SideBar isOpen={isSidebarOpen} closeSidebar={handleCloseSidebar}>
                        {/* Aquí van los filtros, inputs, etc. */}
                    </SideBar>
                )}

                {/* Layout principal */}
                <div className={Styles.generalContainer}>
                    {/* Sidebar sticky solo en desktop */}
                    {!isMobile && (
                        <div className={sideBarStyles.sidebarContainer}>
                            <SideBar isOpen={true} closeSidebar={() => {}}>
                                {/* Aquí van los filtros, inputs, etc. */}
                            </SideBar>
                        </div>
                    )}
                    <div className={Styles.productsAndHighlightContainer}>
                        <div className={Styles.productsWrapper}>
                            {items.length > 0 && <Products items={items} />}
                            {items.length === 0 && <div className={Styles.shopGridWrapper}>Sin coincidencias</div>}
                        </div>
                    </div>
                </div>
                {hasMore && <div ref={lastProductElementRef} className={Styles.loadingSentinel}>Cargando más productos...</div>}
                {!hasMore && items.length > 0 && <div className={Styles.noMoreProducts}>No hay más productos para mostrar.</div>}
            </div>
        </div>
    );
};

export default Shop;