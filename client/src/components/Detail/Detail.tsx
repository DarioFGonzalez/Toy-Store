import axios from 'axios';
import type { Product } from '../../types/index.js';
import { emptyProduct, URL } from '../../types/constants.js';
import { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import React from 'react';
import { useParams } from "react-router-dom";
import style from "./Detail.module.css";
import { Toast, ToastContainer } from 'react-bootstrap';

const Detail: React.FC = () => {
  const { id } = useParams();

  const [cardDetail, setCardDetail] = useState<Product>(emptyProduct);
  const [inputValue, setInputValue] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);

  const [show, setShow] = useState<boolean>(false);

  useEffect(() => {
    axios.get(`${URL}product/${id}`)
      .then(({ data }) => {
        setCardDetail(data);
        if (data.imageUrl && data.imageUrl.length > 0) {
          setMainImage(data.imageUrl[0].url);
        }
      })
      .catch((err) => { console.error(err); console.log(err.message); });
  }, [id]);

  useEffect(() => {
    const price = Number(cardDetail?.price) * 100 || 0;
    setTotalPrice((price * inputValue) / 100);
  }, [cardDetail?.price, inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0) {
      setInputValue(value);
    }
  };

  const addToCart = () => {
    const cartId = localStorage.getItem("cartId");

    if (cartId === null) {
      axios.post(`${URL}cart`, { productId: cardDetail.id, quantity: inputValue })
        .then(({ data }) => {
          localStorage.setItem("cartId", JSON.stringify(data.id));
          setShow(true);
        })
        .catch((err) => console.log(err));
    } else {
      axios.patch(`${URL}cart/${JSON.parse(cartId)}`, { productId: cardDetail.id, quantity: inputValue })
        .then(({ data }) => {
          localStorage.setItem('cartId', JSON.stringify(data.id));
          setShow(true);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleThumbnailClick = (url: string) => {
    setMainImage(url);
  };
  
  return (
    <div className={style.containerDetail}>
      <button onClick={handleBack} className={style.backButton}>
        <IoArrowBackCircleOutline />
      </button>

      <div className={style.detailLayout}>
        <div className={style.thumbnailColumn}>
          {cardDetail.imageUrl && cardDetail.imageUrl.map((item, index) => {
            const transformedUrl = item.url.replace('/upload/', '/upload/w_100,h_100,c_fit,f_auto,q_auto/');
            return (
              <img
                key={index}
                src={transformedUrl}
                alt={`Thumbnail ${index}`}
                className={`${style.thumbnail} ${mainImage === item.url ? style.activeThumbnail : ''}`}
                onClick={() => handleThumbnailClick(item.url)}
              />
            );
          })}
        </div>

        <div className={style.mainImageContainer}>
          <img
            src={mainImage?.replace('/upload/', '/upload/w_500,h_500,c_fit,f_auto,q_auto/')}
            alt={cardDetail.name}
            className={style.mainImage}
          />
        </div>

        <div className={style.detailInfo}>
          <div className={style.infoSection}>
            <h1 className={style.productName}>{cardDetail.name}</h1>
            <p className={style.priceHolder}>$ {cardDetail.price} (STOCK: {cardDetail.stock})</p>
            <p className={style.brandHolder}>{'['}{cardDetail.category}{']'}</p>
            { cardDetail.medidas && <p className={style.brandHolder}>{'('} {cardDetail.medidas} {' CM)'}</p>}
            <p className={style.brandHolder}>Material: {cardDetail.material}</p>
          </div>

          <hr className={style.divider} />

          <div className={style.ctaSection}>
            <input type='number' value={inputValue} onChange={handleInputChange} min='1' />
            <p>SubTotal: ${totalPrice}</p>
            <button onClick={addToCart} disabled={cardDetail.stock <= 0 || inputValue > cardDetail.stock}>
              Agregar al carrito 🛒
            </button>
            <ToastContainer position="top-end" className="p-3">
              <Toast show={show} autohide delay={2500} onClose={() => setShow(false)} bg="success">
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
          </div>

          <div className={style.description}>
            <h2 className={style.descriptionTitle}>Descripción</h2>
            <p>{cardDetail.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detail;