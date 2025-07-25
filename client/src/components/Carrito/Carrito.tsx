import React, { useState, useEffect } from 'react';
import styles from './Carrito.module.css';
import type { Cart, ContactInfo, ProductInCart } from '../../types';
import axios from 'axios';
import { emptyCart, emptyContactInfo, URL } from '../../types/constants';

const Carrito: React.FC = () =>
{
    const [cart, setCart] = useState<Cart>( emptyCart );
    const [ form, setForm ] = useState<ContactInfo>( emptyContactInfo );
    const [ showExtra, setShowExtra ] = useState<boolean>( false );
    const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{2,}\.(com|es|ar)$/;
    const [ wrongEmail, setWrongEmail ] = useState<boolean>( false );
    const [ noAddress, setNoAddress ] = useState<boolean>( false );
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

  const handleCheckout = (): void =>
  {
    setWrongEmail( !emailRegex.test(form.email) );
    if( showExtra )
    {
      setNoAddress( form.address=='' ? true : false );
      setNoNumber( form.number=='' ? true : false );
    }
    
    if( (showExtra && (form.address=='' || form.number=='') ) || !emailRegex.test(form.email) ) return ;

    setWrongEmail( false );
    setNoAddress( false );
    setNoNumber( false );
    
    axios.post(`${URL}checkout`, {cart, form}).then( ( { data } ) =>
    {
      alert('¡Gracias por su compra!');
      window.location.replace(data.URL);
    })
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
            <div className={styles.shippingToggle}>
              <input type='checkbox' id="showShippingInfo" onClick={()=>setShowExtra(prev => !prev)}/>
              <label htmlFor="showShippingInfo">Quiero ingresar datos de envío</label>
            </div>

            { showExtra && (
              <div className={styles.shippingInfoFields}>
                <div className={styles.formGroup}>
                  <label htmlFor="address">Dirección:</label>
                  <input
                    type="text"
                    id="address"
                    value={form.address}
                    onChange={handleChange}
                    name='address'
                    className={styles.inputField}
                  />
                </div>
                {noAddress && <p className={styles.errorMessage}>Ingrese una dirección de entrega.</p>}
                <div className={styles.formGroup}>
                  <label htmlFor="number">Teléfono:</label>
                  <input
                    type="text"
                    id="number"
                    value={form.number}
                    onChange={handleChange}
                    name='number'
                    className={styles.inputField}
                  />
                </div>
                {noNumber && <p className={styles.errorMessage}>Ingrese un teléfono de contacto.</p>}
              </div>
            )}
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={form.email}
                onChange={handleChange}
                name='email'
                className={styles.inputField}
              />
            </div>
            {wrongEmail && <p className={styles.errorMessage}>Ingrese un Email válido, por favor.</p>}
            
            <hr className={styles.summarySeparator}/>

            <p className={styles.subtotal}>Subtotal ({cart.products.length} items): <span>${subtotal.toFixed(2)}</span></p>
            <button onClick={handleCheckout} className={styles.checkoutButton} disabled={sinStock}>Ir al Checkout</button>
            <button onClick={clearCart} className={styles.clearCartButton}>Vaciar Carrito</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;