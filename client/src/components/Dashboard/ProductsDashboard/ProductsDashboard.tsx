import React, { useEffect, useState } from 'react';
import styles from './ProductsDashboard.module.css';
import ProductCard from './ProductCard/ProductCard';
import type { Product } from '../../../types';
import axios from 'axios';
import { URL } from '../../../types/constants';
import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        axios.get(`${URL}product`)
            .then(({ data }) => setProducts(data))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.searchBarContainer}>
                <input
                    type="text"
                    placeholder="Buscar..."
                    className={styles.searchBar}
                />
            </div>
            <div className={styles.tableContainer}>
                {products.length > 0 ? (
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>Imagen</th>
                                <th style={{ width: '1fr' }}>Nombre</th>
                                <th style={{ width: '120px' }}>Stock</th>
                                <th style={{ width: '120px' }}>Precio</th>
                                <th style={{ width: '150px' }}>Visible</th>
                                <th style={{ width: '80px' }}>Favorito</th>
                                <th style={{ width: '100px' }}>Descripción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <ProductCard key={item.id} item={item} isTableRow={true} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <label>Sin items que mostrar</label>
                )}
            </div>
        </div>
    );
};

export default ProductDashboard;