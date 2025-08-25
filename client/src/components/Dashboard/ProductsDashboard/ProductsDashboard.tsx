import React, { useEffect, useState } from 'react';
import styles from './ProductsDashboard.module.css';
import ProductCard from './ProductCard/ProductCard';
import ProductFilters from './ProductFilter/ProductFilter';
import type { Product } from '../../../types';
import axios from 'axios';
import { URL } from '../../../types/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import type { DashboardFilters } from '../../../types';
import { emptyFilters } from '../../../types/constants';

const ProductDashboard: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [filters, setFilters] = useState<DashboardFilters>(emptyFilters);

    useEffect(() => {
        axios.get(`${URL}product`)
            .then(({ data }) => {
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        const applyFilters = () => {
            let result = products;

            if (filters.name) {
                result = result.filter(product =>
                    product.name.toLowerCase().includes(filters.name.toLowerCase())
                );
            }

            if (filters.category) {
                result = result.filter(product =>
                    product.category.toLowerCase() === filters.category.toLowerCase()
                );
            }

            if (filters.medida) {
                result = result.filter(product =>
                    (product as any).measure.toLowerCase() === filters.medida.toLowerCase()
                );
            }

            if (filters.material) {
                result = result.filter(product =>
                    (product as any).material.toLowerCase() === filters.material.toLowerCase()
                );
            }

            if (filters.highlighted) {
                result = result.filter(product => product.highlighted);
            }

            if (filters.visible) {
                result = result.filter(product => product.visible);
            }

            setFilteredProducts(result);
        };

        applyFilters();
    }, [filters, products]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFilters(prev => ({ ...prev, [name]: checked }));
        } else {
            setFilters(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleClearFilters = () => {
        setFilters(emptyFilters);
    };

    return (
        <div className={styles.dashboardContainer}>
            <ProductFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
            />
            <div className={styles.tableContainer}>
                {filteredProducts.length > 0 ? (
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
                            {filteredProducts.map((item) => (
                                <ProductCard key={item.id} item={item} isTableRow={true} />
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.noItems}>
                        <p>No se encontraron items que coincidan con los filtros.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDashboard;