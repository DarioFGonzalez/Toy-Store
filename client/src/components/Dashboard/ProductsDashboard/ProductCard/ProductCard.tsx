import React, { useState } from 'react';
import styles from './ProductCard.module.css';
import type { editForm, Product, ProductCardProps } from '../../../../types';
import axios from 'axios';
import { emptyEditForm, URL } from '../../../../types/constants';


const ProductCard: React.FC<ProductCardProps> = ( { item } ) =>
{
  const [ product, setProduct ] = useState<Product>( item );
  const [ edit, setEdit ] = useState<editForm>( emptyEditForm );
  const adminToken = localStorage.getItem( 'adminToken' );

  const handleVisibilityChange = (e: React.ChangeEvent<HTMLInputElement>) =>
  {
    const isVisible = e.target.value === 'true';
    
    axios.put(`${URL}product/${item.id}`, { visible: isVisible }, { headers: { 'Authorization': `Bearer ${adminToken}` } } )
    .then( ( { data } ) => setProduct( data ) )
    .catch( ( err ) => console.log( "Hubo un error al actualizar la visibilidad del producto. ", err ) );
  }

  const handleUpdate = ( e: React.KeyboardEvent<HTMLInputElement> ) =>
  {
    if(e.key!=='Enter') return;

    e.preventDefault();
    const fieldName = e.currentTarget.name;
    const fieldValue = e.currentTarget.value;

    axios.put( `${URL}product/${product.id}`, { [fieldName]: fieldValue }, { headers: { 'Authorization': `Bearer ${adminToken}` } } )
    .then( ( { data } ) => setProduct( data ) )
    .catch( ( err ) => console.log( err.message ) );

    setEdit( ( prevInfo ) => ( { ...prevInfo, [fieldName]: false } ) );
  }

  return (
    <div className={styles.card}>
      <img src={product.imageUrl[0]} alt={product.name} className={styles.cardImage} />

      {!edit.name && <span onClick={()=>setEdit( prevInfo => ( { ...prevInfo, name: true } ) )} className={styles.cardName}>{product.name}</span>}
      {edit.name && <input placeholder={product.name} onKeyDown={handleUpdate} name='name' />}

      {!edit.stock && <span onClick={()=>setEdit( prevInfo => ( { ...prevInfo, stock: true } ) )} className={styles.cardStock}>Stock: {product.stock}</span>}
      {edit.stock && <input type='number' placeholder={product.stock.toString()} onKeyDown={handleUpdate} name='stock' />}
      
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