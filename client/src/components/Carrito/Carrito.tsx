import React, { useState, useEffect } from 'react';
import styles from './Carrito.module.css';
import type { CartItem } from '../../types';
import axios from 'axios';
import { URL } from '../../types/constants';
import { useNavigate } from 'react-router-dom';

const Carrito: React.FC = () =>
{
    const navigate = useNavigate();
    const [cart, setCart] = useState<CartItem[]>([]);
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() =>
    {
        const storedCart = localStorage.getItem('activeCarrito');
        if(storedCart)
        {
            setCart( JSON.parse(storedCart) );
        }
    }, []);

    useEffect( () =>
    {
        if(cart.length!==0)
        {
            const total = cart.reduce((acc, item) => acc + item.item.price * item.quantity, 0);
            setSubtotal(total);
        }
    }, [cart]);

    const updateQuantity = (id: string, newQuantity: number) =>
    {
        const updatedItems = cart.map(item =>
            item.item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
        );
        setCart(updatedItems);
        localStorage.setItem( 'activeCarrito', JSON.stringify(updatedItems) );
    };

    const removeItem = (id: string) =>
    {
        const updatedItems = cart.filter( item => item.item.id !== id );
        setCart(updatedItems);
        localStorage.setItem( 'activeCarrito', JSON.stringify(updatedItems) );
    };

    const handleCheckout = () =>
    {
        axios.post(`${URL}checkout`, cart).then( ( { data } ) =>
        {
          console.log(data.URL);
          window.location.replace(data.URL);
        })
        .catch( ( err ) => console.log( err ) );
    };

  const clearCart = () =>
    {
        setCart([]);
        localStorage.removeItem('activeCart');
    };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Carrito de Compras</h1>

      {cart.length === 0 ? (
        <p className={styles.emptyCartMessage}>Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className={styles.cartItemsList}>
            {cart.map((item) => (
              <li key={item.item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img src={item.item.image} alt={item.item.name} />
                </div>
                <div className={styles.itemDetails}>
                  <h2 className={styles.itemName}>{item.item.name}</h2>
                  <p className={styles.itemPrice}>${item.item.price}</p>
                  <div className={styles.quantityControl}>
                    <button onClick={() => updateQuantity(item.item.id, item.quantity - 1)}>-</button>
                    <span className={styles.itemQuantity}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <p className={styles.itemSubtotal}>Subtotal: ${(item.item.price * item.quantity).toFixed(2)}</p>
                  <button onClick={() => removeItem(item.item.id)} className={styles.removeButton}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>

          <div className={styles.cartSummary}>
            <p className={styles.subtotal}>Subtotal ({cart.length} items): <span>${subtotal.toFixed(2)}</span></p>
            <button onClick={handleCheckout} className={styles.checkoutButton}>Ir al Checkout</button>
            <button onClick={clearCart} className={styles.clearCartButton}>Vaciar Carrito</button>
            {/* <button className={styles.continueShoppingButton}>Seguir Comprando</button> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;