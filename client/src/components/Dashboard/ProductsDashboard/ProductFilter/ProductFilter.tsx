import React from 'react';
import {
    FormControl,
    InputGroup,
    FormSelect,
    Button,
    FormCheck
} from 'react-bootstrap';
import styles from './ProductFilter.module.css';
import type { DashboardFilters } from '../../../../types';

interface ProductFiltersProps {
    filters: DashboardFilters;
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onClearFilters: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters, onFilterChange, onClearFilters }) => {
    return (
        <div className={styles.searchBarContainer}>
            <InputGroup className="mb-3">
                <FormControl
                    placeholder="Buscar por nombre..."
                    aria-label="Buscar productos"
                    name="name"
                    value={filters.name}
                    onChange={onFilterChange}
                    className={styles.searchInput}
                />
                <FormSelect
                    name="category"
                    value={filters.category}
                    onChange={onFilterChange}
                    className={styles.selectFilter}
                >
                    <option value='' disabled>Categoria:</option>
                    <option value='aros'> Aros </option>
                    <option value='anillos'> Anillos </option>
                    <option value='cadenitas'> Cadenitas </option>
                    <option value='chokers'> Chokers </option>
                    <option value='collares'> Collares </option>
                    <option value='gargantillas'> Gargantillas </option>
                    <option value='pulseras'> Pulseras </option>
                    <option value='tobilleras'> Tobilleras </option>
                    <option value='otros'> Otros </option>
                </FormSelect>
                <FormSelect
                    name="medida"
                    value={filters.medida}
                    onChange={onFilterChange}
                    className={styles.selectFilter}
                >
                    <option value='' disabled>Medida:</option>
                    <option value='30'> 30 CM </option>
                    <option value='40'> 40 CM </option>
                    <option value='50'> 50 CM </option>
                    <option value='60'> 60 CM </option>
                    <option value='70'> 70 CM </option>
                    <option value='80'> 80 CM </option>
                    <option value='90'> 90 CM </option>
                    <option value='100'> 100 CM </option>
                </FormSelect>
                <FormSelect
                    name="material"
                    value={filters.material}
                    onChange={onFilterChange}
                    className={styles.selectFilter}
                >
                    <option value='' disabled>Material:</option>
                    <option value='acero quirurgico'> Acero quirúrgico </option>
                    <option value='alambre con memoria'> Alambre con memoria </option>
                    <option value='cristal checo'> Cristal checo </option>
                    <option value='fundicion'> Fundición </option>
                    <option value='hilo encerado'> Hilo encerado </option>
                    <option value='madera'> Madera </option>
                    <option value='mostacillas'> Mostacillas </option>
                    <option value='perlas de vidrio'> Perlas de vidrio </option>
                    <option value='perlas acrilicas'> Perlas acrilicas </option>
                    <option value='piedras semipreciosas'> Piedras semipreciosas </option>
                    <option value='tanza de acero'> Tanza de acero </option>
                    <option value='tanza elastica'> Tanza elástica </option>
                </FormSelect>
                <InputGroup.Text>
                    <FormCheck
                        type="checkbox"
                        label="Fav."
                        name="highlighted"
                        checked={filters.highlighted}
                        onChange={onFilterChange}
                        className={styles.filterCheck}
                    />
                </InputGroup.Text>
                <InputGroup.Text>
                    <FormCheck
                        type="checkbox"
                        label="Visible"
                        name="visible"
                        checked={filters.visible}
                        onChange={onFilterChange}
                        className={styles.filterCheck}
                    />
                </InputGroup.Text>
                <Button variant="outline-secondary" onClick={onClearFilters} className={styles.clearButton}>
                    Limpiar
                </Button>
            </InputGroup>
        </div>
    );
};

export default ProductFilters;