import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SideBar.module.css';

interface Filters {
  name: string;
  category: string;
  medida: string;
  material: string;
  minPrice?: number;
  maxPrice?: number;
}

const emptyFilter = {
  name: '',
  category: '',
  medida: '',
  material: '',
};

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Filters>(emptyFilter);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const buscar = (): void => {
    const queryParams = new URLSearchParams();

    for (const key in filter) {
      const value = filter[key as keyof Filters];
      if (value !== '' && value !== undefined) {
        queryParams.set(key, String(value));
      }
    }
    const queryString = queryParams.toString();
    navigate(`/shop${queryString ? `?${queryString}` : ''}`);
  };

  const limpiar = (): void => {
    setFilter(emptyFilter);
    navigate('/shop');
  };

  const minmaxPrice = (): boolean => {
    if (filter.maxPrice && filter.minPrice) {
      if (filter.minPrice > filter.maxPrice) {
        return true;
      }
      return false;
    }
    return false;
  };

  return (
    <div className={styles.sidebarContainer}>
      <div className={styles.filterSection}>
        <input
          onChange={handleChange}
          value={filter.name}
          placeholder="Nombre del producto"
          name={'name'}
          className={styles.filterInput}
        />

        <div className={styles.priceContainer}>
          <input
            onChange={handleChange}
            value={filter.minPrice || ''}
            placeholder="Min"
            name={'minPrice'}
            type="number"
            className={styles.priceInput}
          />
          <label className={styles.priceSeparator}> - </label>
          <input
            onChange={handleChange}
            value={filter.maxPrice || ''}
            placeholder="Max"
            name={'maxPrice'}
            type="number"
            className={styles.priceInput}
          />
        </div>
        {minmaxPrice() && <p className={styles.errorLabel}>min {'<'} max</p>}

        <select
          value={filter.category}
          name="category"
          onChange={handleChange}
          className={styles.selectFilter}
        >
          <option value="">Categorías</option>
          <option value="aros"> Aros </option>
          <option value="anillos"> Anillos </option>
          <option value="cadenitas"> Cadenitas </option>
          <option value="chokers"> Chokers </option>
          <option value="collares"> Collares </option>
          <option value="gargantillas"> Gargantillas </option>
          <option value="pulseras"> Pulseras </option>
          <option value="tobilleras"> Tobilleras </option>
          <option value="otros"> Otros </option>
        </select>

        <select
          value={filter.medida}
          name="medida"
          onChange={handleChange}
          className={styles.selectFilter}
        >
          <option value="">Medidas</option>
          <option value="30"> 30 CM </option>
          <option value="40"> 40 CM </option>
          <option value="50"> 50 CM </option>
          <option value="60"> 60 CM </option>
          <option value="70"> 70 CM </option>
          <option value="80"> 80 CM </option>
          <option value="90"> 90 CM </option>
          <option value="100"> 100 CM </option>
        </select>

        <select
          value={filter.material}
          name="material"
          onChange={handleChange}
          className={styles.selectFilter}
        >
          <option value="">Materiales</option>
          <option value="acero quirurgico"> Acero quirúrgico </option>
          <option value="alambre con memoria"> Alambre con memoria </option>
          <option value="cristal checo"> Cristal checo </option>
          <option value="fundicion"> Fundición </option>
          <option value="hilo encerado"> Hilo encerado </option>
          <option value="madera"> Madera </option>
          <option value="mostacillas"> Mostacillas </option>
          <option value="perlas de vidrio"> Perlas de vidrio </option>
          <option value="perlas acrilicas"> Perlas acrilicas </option>
          <option value="piedras semipreciosas"> Piedras semipreciosas </option>
          <option value="tanza de acero"> Tanza de acero </option>
          <option value="tanza elastica"> Tanza elástica </option>
        </select>
      </div>

      <button className={styles.sidebarButton} onClick={buscar}>
        BUSCAR
      </button>
      <button className={styles.sidebarButton} onClick={limpiar}>
        LIMPIAR
      </button>
    </div>
  );
};

export default Sidebar;