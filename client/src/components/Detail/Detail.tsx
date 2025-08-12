import axios from 'axios';
import type { Product } from '../../types/index.js';
import { emptyProduct, URL } from '../../types/constants.js';
import { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import React from 'react';
import { useParams } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import style from "./Detail.module.css"

const Detail: React.FC = () =>
{
  const { id } = useParams();

  const [cardDetail, setCardDetail] = useState<Product>(emptyProduct);
  const [inputValue, setInputValue] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() =>
  {
    axios.get(`${URL}product/${id}`)
      .then( ( { data } ) => setCardDetail( data ) )
      .catch( ( err ) => { console.error( err ); console.log( err.message ); } )
  }, [id]);

  useEffect(() => {
    const price = Number(cardDetail?.price) * 100 || 0;
    setTotalPrice( (price * inputValue) / 100 );
  }, [cardDetail?.price, inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) =>
  {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0)
    {
      setInputValue(value);
    }
  };

  const addToCart = () =>
  {
    const cartId = localStorage.getItem("cartId");

    if( cartId === null )
    {
      axios.post(`${URL}cart`, { productId: cardDetail.id, quantity: inputValue } )
        .then( ( { data } ) =>
        {
          localStorage.setItem("cartId", JSON.stringify( data.id ) );
          alert('¡Carrito creado!');
        })
        .catch( ( err ) => console.log( err ) );
    }
    else
    {
      axios.patch(`${URL}cart/${JSON.parse(cartId)}`, { productId: cardDetail.id, quantity: inputValue } )
        .then( ( { data } ) =>
        {
          localStorage.setItem( 'cartId', JSON.stringify( data.id ) );
          alert('¡Item agregado!');
        })
        .catch( ( err ) => console.log( err ) );
    }
  };

  const handleBack = () =>
  {
    window.history.back();
  }

  return (
    <div className={style.containerDetail}>
      <button onClick={handleBack}>
        <IoArrowBackCircleOutline className={style.backButton} />
      </button>

      <div className={style.detailContainer}>
        <div className={style.imgContainer}>
          <Carousel slide={false} interval={10000} pause="hover">
            {cardDetail.imageUrl && cardDetail.imageUrl.map( (item, index) => {
              const transformedUrl = item.replace(
                '/upload/',
                '/upload/w_465,h_465,c_fill,f_auto,q_auto/'
              );
              return (
                <Carousel.Item key={index} style={{ height: '465px' }}>
                  <img className={style.carouselImg} src={transformedUrl} alt={cardDetail.name} />
                </Carousel.Item>
              );
            })}
          </Carousel>
        </div>

        <div className={style.detailInfo}>
          <div>
            <h1 className={style.productName}>{cardDetail.name}</h1>
            <p className={style.priceHolder}>$ {cardDetail.price} {'('} {cardDetail.stock} {')'}</p>
            <p className={style.brandHolder}>{cardDetail.category}</p>
          </div>

          <hr />

          <input type='number' value={inputValue} onChange={handleInputChange} min='1' />
          <p> SubTotal: ${totalPrice} </p>

          <div className={style.carrito}>
            <button onClick={addToCart} disabled={cardDetail.stock<=0 || inputValue>cardDetail.stock}> Agregar al carrito 🛒</button>
          </div>
        </div>
      </div>
      
      <div className={style.containerReview}>
        <div className={style.description}>
            {cardDetail.description}
          {/* <Reviews /> */}
        </div>
      </div>
    </div>
  )
};

export default Detail;