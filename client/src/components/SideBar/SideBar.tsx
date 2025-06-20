import React, { useState } from 'react';
import styles from './SideBar.module.css';
import { useNavigate } from 'react-router-dom';

interface Filters
{
  name: string,
  category: string,
  minPrice?: number,
  maxPrice?: number
}

const emptyFilter =
{
  name: '',
  category: ''
}

const Sidebar: React.FC = ( ) =>
{
  const navigate = useNavigate();
  const [ filter, setFilter ] = useState<Filters>( emptyFilter );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement>): void =>
  {
    const { name, value } = e.target;

    setFilter( prev => ({ ...prev, [name]: value }) )
  }

  const buscar = (): void =>
  {
    const queryParams = new URLSearchParams();

    for(const key in filter)
    {
      const value = filter[key as keyof Filters];
      if(value!=='' && value)
      {
        queryParams.set(key, String(value) );
      }
    }
    const queryString = queryParams.toString();
    navigate(`/shop${queryString ? `?${queryString}` : '' }`);
  }

  const limpiar = (): void =>
  {
    setFilter( emptyFilter );
    navigate('/shop');
  }

  const minmaxPrice = (): boolean =>
  {
    if(filter.maxPrice && filter.minPrice)
    {
      if(filter.minPrice > filter.maxPrice)
      {
        return true;
      }
      return false;
    }
    return false;
  }

  return(
    <div className={styles.sidebarContainer}>
      <button className={styles.sidebarButton} onClick={()=>console.log(filter)}> Filtros </button>
      <input onChange={handleChange} value={filter.name} placeholder='Nombre del producto' name={'name'}/>
      
      <div className={styles.priceContainer}>
        <input onChange={handleChange} value={filter.minPrice || ''}
        placeholder='Min' name={'minPrice'} type='number' />
        <label className={styles.priceSeparator}> - </label>
        <input onChange={handleChange} value={filter.maxPrice || ''}
        placeholder='Max' name={'maxPrice'} type='number' />
      </div>
      { minmaxPrice() &&<p className={styles.errorLabel}>
        min {'<'} max </p>}

      <select value={ filter.category || '' } name='category' onChange={handleChange} >
        <option value='' disabled selected> Categorías </option>
        <option value='peluche'> Peluche </option>
        <option value='muñeco'> Muñeco </option>
        <option value='juego de mesa'> Juego de mesa </option>
        <option value='otros'> Otros </option>
      </select>
      <button className={styles.sidebarButton} onClick={buscar}> BUSCAR </button>
      <button className={styles.sidebarButton} onClick={limpiar}> Limpiar búsqueda </button>
    </div>
  );
};

export default Sidebar;