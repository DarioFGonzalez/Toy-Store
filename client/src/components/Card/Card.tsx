import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Styles from './Card.module.css';
import type { CardProps } from '../../types/index';
import axios from 'axios';
import { URL } from '../../types/constants';
import { ToastContainer, Toast } from 'react-bootstrap';

const Card: React.FC<CardProps> = ( { product } ) =>
{
  const [cant, setCant] = useState<number>(1);
  const [show, setShow] = useState<boolean>(false);

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
          setShow(true);
        })
        .catch((err) => console.log(err));
    } else {
      axios.patch(`${URL}cart/${JSON.parse(cartId)}`, { productId: product.id, quantity: cant })
        .then(({ data }) => {
          localStorage.setItem('cartId', JSON.stringify(data.id));
          setShow(true);
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

      <button type="button" className={Styles.buyButton} onClick={addToCart}>

        <ToastContainer position="top-end" className="p-3">
          <Toast show={show} autohide delay={1500} onClose={() => setShow(false)} bg="success">
            <Toast.Body>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 600,
                fontSize: '1.1rem',
                color: '#fff',
                padding: '12px 0',
                letterSpacing: '0.5px'
              }}>
                <span style={{
                  fontSize: '2rem',
                  marginBottom: '6px',
                  display: 'block'
                }}>🎉</span>
                <span>¡Producto agregado!</span>
              </div>
            </Toast.Body>
          </Toast>
        </ToastContainer>

        <span className={Styles.button__text}>Agregar</span>
        <span className={Styles.button__icon}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className={Styles.svg}>
            <line y2="19" y1="5" x2="12" x1="12"></line>
            <line y2="12" y1="12" x2="19" x1="5"></line>
          </svg>
        </span>
      </button>

    </div>
  );
};

export default Card;