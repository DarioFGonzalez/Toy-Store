import React, { useState, useEffect } from 'react';
import styles from './Carrito.module.css';
import type { Cart, ContactInfo, ProductInCart } from '../../types';
import axios from 'axios';
import { emptyCart, emptyContactInfo, URL } from '../../types/constants';

const Carrito: React.FC = () =>
{
    const [cart, setCart] = useState<Cart>( emptyCart );
    const [ form, setForm ] = useState<ContactInfo>( emptyContactInfo );
    const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{2,}\.(com|es|ar)$/;
    const [ wrongEmail, setWrongEmail ] = useState<boolean>( false );
    const [sinStock, setSinStock] = useState<boolean>( false );
    const [subtotal, setSubtotal] = useState(0);

    useEffect((): void =>
    {
        const cartId = localStorage.getItem('cartId');
        if(cartId)
        {
          axios.get(`${URL}cart/${JSON.parse(cartId)}`)
          .then( ( {data} ) =>
            {
              setCart( data );
              const products = data.products;
              products.forEach( (item: ProductInCart) => item.stock < item.CartItem.quantity ? setSinStock( true ) : '' );
            } )
          .catch( ( err ) => console.log( err ) );
        }
    }, []);

    useEffect( (): void =>
    {
        if(cart.id!=='')
        {
            const sumTotal = cart.products.reduce( (acc, item) => acc + (Number(item.price) * 100) * item.CartItem.quantity , 0);
            const total = sumTotal!==0 ? sumTotal / 100 : 0;
            setSubtotal(total);
        }
    }, [cart]);

  const updateQuantity = (id: string, newQuantity: number): void =>
  {
    axios.patch(`${URL}cart/${cart.id}`, { productId: id, quantity: newQuantity } )
    .then( ( { data } ) => setCart( data ) )
    .catch( ( err ) => console.log( err ) );
  };

  const handleCheckout = (): void =>
  {
    console.log("Entré");
    if( emailRegex.test(form.email) )
    {
      console.log('Entré al post');
      setWrongEmail( false );
      axios.post(`${URL}checkout`, {cart, form}).then( ( { data } ) =>
      {
        alert('¡Gracias por su compra!');
        window.location.replace(data.URL);
      })
      .catch( ( err ) => console.log( err ) );
      return ;
    }
    setWrongEmail( true );
    return ;
  };

  const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>
  {
    const { name, value } = e.target;
    setForm( prev => ({ ...prev, [name]: value }) );
  };

  const clearCart = (): void =>
  {
    axios.delete(`${URL}cart/clean/${cart.id}`)
    .then( ( { data } ) => setCart( data ) )
    .catch( ( err ) => console.log( err ) );
  };

  const decimalTreatment = ( number: string, quantity: number): string =>
  {
    return ( ( ( Number(number) * 100 ) * quantity ) / 100).toFixed(2);
  };

  const validQuantity = ( quantity: number, difference: number, totalAmmount: number ): boolean =>
  {
    if(difference==-1)
    {
      if( quantity + difference <=0 ) return true;
      return false;
    }

    if( quantity + difference > totalAmmount ) return true;
    return false;
  };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Carrito de Compras</h1>

      {cart.products.length === 0 ? (
        <p className={styles.emptyCartMessage}>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className={styles.cartItemsList}>
            {cart.products.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.name} />
                </div>
                <div className={styles.itemDetails}>
                  <h2 className={styles.itemName}>{item.name}</h2>
                  <p className={styles.itemPrice}>${item.price}</p>
                  <div className={styles.quantityControl}>
                    <button onClick={() => updateQuantity(item.id, item.CartItem.quantity - 1)}
                      disabled={validQuantity(item.CartItem.quantity, -1, item.stock)}>-</button>
                    <span className={styles.itemQuantity}>{item.CartItem.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.CartItem.quantity + 1)} 
                      disabled={validQuantity(item.CartItem.quantity, +1, item.stock)}>+</button>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <p className={styles.itemSubtotal}>Subtotal: ${decimalTreatment(item.price, item.CartItem.quantity)}</p>
                  <button onClick={() => updateQuantity(item.id, 0)} className={styles.removeButton}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.cartSummary}>
            <label> Dirección: </label> <input value={form.address} onChange={handleChange} name='address'/> <hr/>
            <label> Telefono: </label> <input value={form.number} onChange={handleChange} name='number'/> <hr/>
            <label> Email: </label> <input value={form.email} onChange={handleChange} name='email'/>  <br/>
            {wrongEmail && <label style={ { color: 'red' } }> Ingrese un Email válido, por favor. </label>}
            <p className={styles.subtotal}>Subtotal ({cart.products.length} items): <span>${subtotal.toFixed(2)}</span></p>
            <button onClick={()=>console.log(form, "\nRegex del mail: ", emailRegex.test(form.email) )}> form </button>
            <button onClick={handleCheckout} className={styles.checkoutButton} disabled={sinStock}>Ir al Checkout</button>
            <button onClick={clearCart} className={styles.clearCartButton}>Vaciar Carrito</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;