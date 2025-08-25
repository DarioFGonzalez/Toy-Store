import React from 'react';
import type { Product } from '../../types';
import Card from '../Card/Card';
import styles from './Products.module.css';

interface ProductsProps {
  items: Product[];
}

const Products: React.FC<ProductsProps> = ({ items }) => {
  return (
    <div className={styles.productsWrapper}>
      <div className={styles.productGridContainer}>
        {items.map((item, index) => (
          item.visible && <Card product={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Products;