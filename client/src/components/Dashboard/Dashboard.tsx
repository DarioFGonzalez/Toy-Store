import type React from 'react';
import DashboardSideBar from './DashboardSideBar/DashboardSideBar';
import ProductDashboard from './ProductsDashboard/ProductsDashboard';
import { useState } from 'react';
import styles from './Dashboard.module.css';
import Create from '../Create/Create';
import CreateBanner from './Banners/CreateBanners';

const Dashboard: React.FC = () =>
{
    const [content, setContent] = useState<string>('products');

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.sidebar}>
                <DashboardSideBar setContent={setContent} />
            </div>
            <div className={styles.mainContent}>
                { content === 'products' && <ProductDashboard /> }
                { content === 'create' && <Create />}
                { content === 'banners' && <CreateBanner />}
            </div>
        </div>
    );
};

export default Dashboard;