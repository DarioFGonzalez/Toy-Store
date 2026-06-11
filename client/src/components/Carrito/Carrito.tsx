import axios from 'axios';
import React, { useEffect, useState } from 'react';
import type { Cart, ContactInfo, ProductInCart } from '../../types';
import { emptyCart, emptyContactInfo, URL } from '../../types/constants';
import styles from './Carrito.module.css';

const Carrito: React.FC = () =>
{
    const [cart, setCart] = useState<Cart>( emptyCart );
    const [ form, setForm ] = useState<ContactInfo>( emptyContactInfo );
    const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{2,}\.(com|es|ar)$/;
    const [ wrongEmail, setWrongEmail ] = useState<boolean>( false );
    const [ noName, setNoName ] = useState<boolean>( false );
    const [ noNumber, setNoNumber ] = useState<boolean>( false );
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

  const handleCheckout = (): void =>
  {
    if( !form.name || !form.phoneNumber || !emailRegex.test(form.mail) )
    {
      setNoName( form.name == '' );
      setWrongEmail( !emailRegex.test(form.mail) );
      setNoNumber( form.phoneNumber == '' );
      return;
    }

    // Enviar carrito a checkout con datos de contacto
    axios.post(`${URL}checkout`, { cartId: cart.id, contactInfo: form })
    .then( ( { data } ) =>
    {
      // Redirigir a MercadoPago
      window.location.replace(data);
    })
    .catch( ( err ) => console.log( err ) );
  };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Carrito de Compras</h1>

      {cart.products.length === 0
      ? ( <p className={styles.emptyCartMessage}>Tu carrito está vacío.</p> )
      : (
        <>
          <div>
            <ul className={styles.cartItemsList}>
              {cart.products.map((item) => (
                <li key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={item.imageUrl[0].url} alt={item.name} />
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
          </div>

          <div className={styles.cartSummary}>
            <div className={styles.shippingInfoFields}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Nombre:</label>
                <input
                  type="text"
                  id="name"
                  value={form.name}
                  onChange={handleChange}
                  name='name'
                  className={styles.inputField}
                />
              </div>
              {noName && <p className={styles.errorMessage}>Ingrese un nombre de destinatario.</p>}
              
              <div className={styles.formGroup}>
                <label htmlFor="phoneNumber">Teléfono:</label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  name='phoneNumber'
                  className={styles.inputField}
                />
              </div>
              {noNumber && <p className={styles.errorMessage}>Ingrese un teléfono de contacto.</p>}
              
              <div className={styles.formGroup}>
                <label htmlFor="mail">Email:</label>
                <input
                  type="email"
                  id="mail"
                  value={form.mail}
                  onChange={handleChange}
                  name='mail'
                  className={styles.inputField}
                />
              </div>
              {wrongEmail && <p className={styles.errorMessage}>Ingrese un Email válido, por favor.</p>}
            </div>

            <hr className={styles.summarySeparator}/>

            <p className={styles.subtotal}>Subtotal ({cart.products.length} items): <span>${subtotal.toFixed(2)}</span></p>
            <p className={styles.total}>Total a pagar: ${subtotal.toFixed(2)}</p>
            
            <button onClick={handleCheckout} className={styles.checkoutButton} disabled={sinStock}>Ir a Pagar</button>
            <button onClick={clearCart} className={styles.clearCartButton}>Vaciar Carrito</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;
