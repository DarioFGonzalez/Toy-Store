import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Styles from './Card.module.css';
import type { CardProps } from '../../types/index';
import axios from 'axios';
import { URL } from '../../types/constants';

const Card: React.FC<CardProps> = ( { product } ) =>
{
  const [cant, setCant] = useState<number>(1);

  const toThumbnail = (url: string): string => {
    const thumbnailUrl = "/upload/h_250,w_250,f_auto,q_auto/";
    const toThumbnailUrl = url.replace('/upload/', thumbnailUrl);
    return toThumbnailUrl;
  };

  const addToCart = (): void => {
    const cartId = localStorage.getItem("cartId");

    if (cartId === null) {
      axios.post(`${URL}cart`, { productId: product.id, quantity: cant })
        .then(({ data }) => {
          localStorage.setItem("cartId", JSON.stringify(data.id));
          alert('¡Item agregado!');
        })
        .catch((err) => console.log(err));
    } else {
      axios.patch(`${URL}cart/${JSON.parse(cartId)}`, { productId: product.id, quantity: cant })
        .then(({ data }) => {
          localStorage.setItem('cartId', JSON.stringify(data.id));
          alert('¡Item agregado!');
        })
        .catch((err) => console.log(err));
    }
  };

  const handleCantChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    const number = parseInt(value, 10);

    if (value === '' || isNaN(number) || number < 1) {
      setCant(1);
    } else {
      setCant(number);
    }
  };

  const handleIncrement = (): void => {
    setCant(prevCant => prevCant + 1);
  };

  const handleDecrement = (): void => {
    setCant(prevCant => Math.max(1, prevCant - 1));
  };

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

      <div className={Styles.counterContainer}>
        <button
          className={Styles.counterButton}
          onClick={handleDecrement}
          aria-label="Disminuir cantidad"
        >
          -
        </button>
        <input
          type="number"
          className={Styles.counterInput}
          value={cant}
          min="1"
          onChange={handleCantChange}
        />
        <button
          className={Styles.counterButton}
          onClick={handleIncrement}
          aria-label="Aumentar cantidad"
        >
          +
        </button>
      </div>

      <button className={Styles.buyButton} onClick={addToCart}>
        Comprar
      </button>
    </div>
  );
};

export default Card;