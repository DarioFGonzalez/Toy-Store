import React, { useState } from 'react';
import styles from './ProductCard.module.css';
import type { Product, ProductCardProps } from '../../../../types';
import axios from 'axios';
import { URL } from '../../../../types/constants';


const ProductCard: React.FC<ProductCardProps> = ( { item } ) =>
{
  const [ product, setProduct ] = useState<Product>( item );

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const isVisible = e.target.value === 'true';
    const adminToken = localStorage.getItem( 'adminToken' );

    axios.put(`${URL}product/${item.id}`, { visible: isVisible }, { headers: { 'Authorization': `Bearer ${adminToken}` } } )
    .then( ( { data } ) => setProduct( data ) )
    .catch( ( err ) => console.log( "Hubo un error al actualizar la visibilidad del producto. ", err ) );
  }

  return (
    <div className={styles.card}>
      <img src={product.image} alt={product.name} className={styles.cardImage} />
      <span className={styles.cardName}>{product.name}</span>
      <span className={styles.cardStock}>Stock: {product.stock}</span>
      
      <div className={styles.visibleActions}>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name={`visibility-${product.id}`}
            value="true"
            checked={product.visible}
            onChange={handleVisibilityChange}
          />
          Visible
        </label>
        <label className={styles.radioLabel}>
          <input
            type="radio"
            name={`visibility-${product.id}`}
            value="false"
            checked={!product.visible}
            onChange={handleVisibilityChange}
          />
          No Visible
        </label>
      </div>

      <button className={styles.modifyButton}>Modificar</button>
    </div>
  );
};

export default ProductCard;