import axios from 'axios';
import type { Product, CartItem } from '../../types/index.js';
import { emptyProduct, URL } from '../../types/constants.js';
import { useEffect, useState } from "react";
import { IoArrowBackCircleOutline } from "react-icons/io5";
import React from 'react';
import { useParams } from "react-router-dom";
import style from "./Detail.module.css"

const Detail: React.FC = () =>
{
  const { id } = useParams();

  const [cardDetail, setCardDetail] = useState<Product>( emptyProduct );
  const [inputValue, setInputValue] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() =>
    {
      axios.get(`${URL}product/${id}`)
      .then( ( { data } ) =>
      {
        setCardDetail( data )

        const cart = localStorage.getItem("activeCarrito");
        if(cart!==null)
        {
          const activeCart = JSON.parse( cart );
          const thisItem = activeCart.find( (cartItem: CartItem) => cartItem.item.id === data.id );
          setInputValue( thisItem.quantity );
        }
      })
      .catch( ( err ) => { console.error( err ); console.log( err.message ); } )
      
    }, [id]);

  useEffect(() => {
    const price = cardDetail?.price || 0;
    setTotalPrice(price * inputValue);
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
  const Cart = localStorage.getItem("activeCarrito");

    if( Cart === null )
    {
      const carrito = [ { item: cardDetail, quantity: inputValue } ];
      console.log("CARRITO: ", carrito);
      localStorage.setItem("activeCarrito", JSON.stringify( carrito ) );
    }
    else
    {
      const activeCart = JSON.parse( Cart );
      const itemExistente = activeCart.find( (cartItem: CartItem) => cartItem.item.id === cardDetail.id );
      if( itemExistente )
      {
        const newCart = activeCart.map( (cartItem: CartItem) => cartItem.item.id === cardDetail.id
          ? { ...cartItem, quantity: inputValue } : cartItem );
        localStorage.setItem("activeCarrito", JSON.stringify( newCart ) );
      }
      else
      {
        const newCart = [ ...activeCart, { item: cardDetail, quantity: inputValue } ];
        localStorage.setItem("activeCarrito", JSON.stringify( newCart ) );
      }
    }
  };

  const handleBack = () =>
  {
    window.history.back();
  }

  return (
			<div className={style.containerDetail}>

				<a onClick={handleBack} href='/home' >
          <IoArrowBackCircleOutline className={style.backButton} />
        </a>

				<div className={style.detailContainer}>
					<div className={style.imgContainer}>
						<img className={style.imgDetail} src={cardDetail.image} alt={cardDetail.name} />
					</div>

					<div className={style.detailInfo}>
						<div>
							<h1 className={style.productName}>{cardDetail.name}</h1>
							<p className={style.priceHolder}>$ {cardDetail.price}</p>
							<p className={style.brandHolder}>{cardDetail.category}</p>
						</div>

						<hr />

            <input type='number' value={inputValue} onChange={handleInputChange} min='1' />
            <p> SubTotal: ${totalPrice} </p>


						<div className={style.carrito}>
							<button onClick={addToCart}> Agregar al carrito 🛒</button>
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