import Card from '../Card/Card.js';
import type { Product } from '../../types/index.js';
import styles from './Products.module.css';

interface ProductsProps {
  items: Product[];
}

const Products: React.FC<ProductsProps> = ({ items }) => {
  return (
    <div className={styles.productsGridWrapper}>
      <div className={styles.productGridContainer}>
        {items?.map((item, index) => (
          item.visible && <Card product={item} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Products;