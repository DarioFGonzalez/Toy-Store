import React, { useEffect, useState } from 'react';
import styles from './ProductsDashboard.module.css';
import ProductCard from './ProductCard/ProductCard';
import type { Product } from '../../../types';
import axios from 'axios';
import { URL } from '../../../types/constants';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    FormControl,
    InputGroup,
    FormSelect,
    Button,
    FormCheck
} from 'react-bootstrap';

// Tipos para los filtros
interface DashboardFilters {
    name: string;
    category: string;
    highlighted: boolean;
    visible: boolean;
}

const emptyFilters: DashboardFilters = {
    name: '',
    category: '',
    highlighted: false,
    visible: false
};

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

    // Lógica de filtrado
    useEffect(() => {
        const applyFilters = () => {
            let result = products;

            // Filtrar por nombre
            if (filters.name) {
                result = result.filter(product =>
                    product.name.toLowerCase().includes(filters.name.toLowerCase())
                );
            }

            // Filtrar por categoría
            if (filters.category) {
                result = result.filter(product =>
                    product.category.toLowerCase() === filters.category.toLowerCase()
                );
            }

            // Filtrar por 'Favorito'
            if (filters.highlighted) {
                result = result.filter(product => product.highlighted);
            }

            // Filtrar por 'Visible'
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
            <div className={styles.searchBarContainer}>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Buscar por nombre..."
                        aria-label="Buscar productos"
                        name="name"
                        value={filters.name}
                        onChange={handleFilterChange}
                        className={styles.searchInput}
                    />
                    <FormSelect
                        name="category"
                        value={filters.category}
                        onChange={handleFilterChange}
                        className={styles.selectFilter}
                    >
                        <option value="">Categoría</option>
                        <option value="peluche">Peluche</option>
                        <option value="muñeco">Muñeco</option>
                        <option value="juego de mesa">Juego de mesa</option>
                        <option value="otros">Otros</option>
                    </FormSelect>
                    <InputGroup.Text>
                        <FormCheck
                            type="checkbox"
                            label="Fav."
                            name="highlighted"
                            checked={filters.highlighted}
                            onChange={handleFilterChange}
                            className={styles.filterCheck}
                        />
                    </InputGroup.Text>
                    <InputGroup.Text>
                        <FormCheck
                            type="checkbox"
                            label="Visible"
                            name="visible"
                            checked={filters.visible}
                            onChange={handleFilterChange}
                            className={styles.filterCheck}
                        />
                    </InputGroup.Text>
                    <Button variant="outline-secondary" onClick={handleClearFilters} className={styles.clearButton}>
                        Limpiar
                    </Button>
                </InputGroup>
            </div>

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