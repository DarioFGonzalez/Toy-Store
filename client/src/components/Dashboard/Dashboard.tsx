import type React from 'react';
import DashboardSideBar from './DashboardSideBar/DashboardSideBar';
import ProductDashboard from './ProductsDashboard/ProductsDashboard';
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
import Create from '../Create/Create';
import CreateBanner from './Banners/CreateBanners';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { URL } from '../../types/constants';

const Dashboard: React.FC = () =>
{
    const [content, setContent] = useState<string>('products');
    const navigate = useNavigate();

    useEffect( () =>
    {
        const adminToken = localStorage.getItem( 'adminToken' );
        axios.get(`${URL}admin`, { headers: { 'authorization': `Bearer ${adminToken}` } } )
        .then( () => console.log( 'Credenciales válidas' ) ).catch( ( err ) =>
        {
            console.error( err.message );
            alert('¡Sesión expirada!');
            navigate('/auth');
        })
    }, [])

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebar}>
                <DashboardSideBar setContent={setContent} />
            </div>
            <div className={styles.mainContent}>
                { content === 'products' && <ProductDashboard /> }
                { content === 'banners' && <CreateBanner />}
                { content === 'create' && <Create />}
            </div>
        </div>
    );
};

export default Dashboard;