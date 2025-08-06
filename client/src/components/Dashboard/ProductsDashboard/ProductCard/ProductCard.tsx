import React from 'react';
import styles from './ProductCard.module.css';
import type { ProductCardProps } from '../../../../types';


const ProductCard: React.FC<ProductCardProps> = ( { item } ) =>
{
  return (
    <div className={styles.card}>
      <img src={item.image} alt={item.name} className={styles.cardImage} />
      <span className={styles.cardName}>{item.name}</span>
      <span className={styles.cardStock}>Stock: {item.stock}</span>
      <div className={styles.visibleActions}>
        <button className={`${styles.visibleButton} ${styles.visibleOn}`}>✔</button>
        <button className={`${styles.visibleButton} ${styles.visibleOff}`}>✖</button>
      </div>
      <button className={styles.modifyButton}>Modificar</button>
    </div>
  );
};

export default ProductCard;