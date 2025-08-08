import React, { useEffect, useState } from 'react';
import styles from './ProductsDashboard.module.css';
import ProductCard from './ProductCard/ProductCard';
import type { Product } from '../../../types';
import axios from 'axios';
import { URL } from '../../../types/constants';



const ProductDashboard: React.FC = () =>
{
  const [ products, setProducts ] = useState<Product[]>( [] );
  
  useEffect( () =>
  {
    axios.get(`${URL}product`)
    .then( ( { data } ) => setProducts( data ) )
    .catch( ( err ) => console.log( err ) );
  }, [])
  
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          placeholder="Buscar..."
          className={styles.searchBar}
        />
      </div>
      <div className={styles.cardsContainer}>
        {products?.map( (item, y) => <ProductCard item={item} key={y}/> )}
        {products.length<=0 && <label> Sin items que mostrar </label>}
      </div>
    </div>
  );
};

export default ProductDashboard;