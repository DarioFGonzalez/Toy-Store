import React from 'react';
import { Link } from 'react-router-dom';
import Styles from './Card.module.css';
import type { Product } from '../../types/index';

interface Props {
  product: Product;
}

const Card: React.FC<Props> = ({ product }) => {

  const toThumbnail = ( url: string ): string =>
  {
  const thumbnailUrl = "/upload/h_250,w_250,f_auto,q_auto/";
  const toThumbnailUrl = url.replace( '/upload/', thumbnailUrl );

  return toThumbnailUrl;
  }
  
  return (
    <div className={Styles.cardContainer}>
      <Link to={`/detail/${product.id}`} className={Styles.link}>
        <div className={Styles.imgContainer}>
          <img
            className={Styles.Img}
            src={toThumbnail(product.imageUrl[0].url)}
            alt={`Imagen de ${product.name}`}
          />
        </div>
        <div className={Styles.infoContainer}>
          <h3 className={Styles.title}>{product.name}</h3>
          <h4 className={Styles.price}>$ {product.price}</h4>
        </div>
      </Link>
      <button className={Styles.buyButton}>Comprar</button>
    </div>
  );
};

export default Card;