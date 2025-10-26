import React, { useState, useEffect } from 'react';
import styles from './Carrito.module.css';
import type { Cart, ContactInfo, MapaDePesos, ProductInCart, CategoriasJoyeria } from '../../types';
import axios from 'axios';
import { emptyCart, emptyContactInfo, URL } from '../../types/constants';
import { PudoSelectionMap } from './PudoSelectionMap/PudoSelectionMap';

const Carrito: React.FC = () =>
{
    const [cart, setCart] = useState<Cart>( emptyCart );
    const [ form, setForm ] = useState<ContactInfo>( emptyContactInfo );
    const [ peso, setPeso ] = useState<number>( 0 );
    const [ showExtra, setShowExtra ] = useState<boolean>( false );
    const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{2,}\.(com|es|ar)$/;
    const [ wrongEmail, setWrongEmail ] = useState<boolean>( false );
    const [ noName, setNoName ] = useState<boolean>( false );
    const [ noSurname, setNoSurname ] = useState<boolean>( false );
    const [ noNumber, setNoNumber ] = useState<boolean>( false );
    const [sinStock, setSinStock] = useState<boolean>( false );
    const [subtotal, setSubtotal] = useState(0);

    /*
    // Espera recibir para la cotización:
    {
    "senderLockerId": 24, // Carrefour en 202 y acceso.
    "receiverLockerId": 456,  // Locker destino.
    "packageSize": {
        "width": 300, 
        "height": 100,
        "length": 250
    },
    "packageWeight": 2.5,
    "declaredValue": 50000 
    }
    //Te devuelve tras una cotización existosa:
    {
    "quoteId": "ABCD123-PUDO-456",
    "deliveryDays": 2,
    "price": 5850.50,
    "priceTax": 950.50,
    "totalPrice": 6801.00,
    "currency": "ARS"
    }
    //Tamaño del paquete:
    Profundidad: 29 cm
    Ancho: 22 cm
    Alto: 6.5 cm
    */

    const pesoPorItem: MapaDePesos =
    {
      'aros': 10, 
      'anillos': 10, 
      'cadenitas': 10, 
      'chokers': 10, 
      'collares': 35, 
      'gargantillas': 12,
      'pulseras': 10,
      'tobilleras': 12
    };

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
            const sumPeso = cart.products.reduce( (acc, item) => acc + pesoPorItem[item.category as CategoriasJoyeria] * item.CartItem.quantity , 0);
            const pesoTotal = sumPeso;
            
            setSubtotal(total);
            setPeso(pesoTotal);
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
      setNoName( form.name=='' ? true : false );
      setNoSurname( form.surname=='' ? true : false );
      setNoNumber( form.number=='' ? true : false );
    }
    
    if( (showExtra && (form.name=='' || form.number=='' || form.surname=='') ) || !emailRegex.test(form.email) ) return ;

    setWrongEmail( false );
    setNoName( false );
    setNoSurname( false );
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
              <li onClick={()=>console.log(item)} key={item.id} className={styles.cartItem}>
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

          <div className={styles.cartSummary}>
            <div className={styles.shippingToggle}>
              <label htmlFor="showShippingInfo">¡Carrito listo para la parte del envío!</label>
              <input type='checkbox' id="showShippingInfo" onClick={()=>setShowExtra(prev => !prev)}/>
            </div>

            { showExtra && (
              <>
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
                    <label htmlFor="surname">Apellido:</label>
                    <input
                      type="text"
                      id="surname"
                      value={form.surname}
                      onChange={handleChange}
                      name='surname'
                      className={styles.inputField}
                    />
                  </div>
                  {noSurname && <p className={styles.errorMessage}>Ingrese el appelido del destinatario.</p>}
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
                </div>
                <PudoSelectionMap key={showExtra.toString()}/>
              </>
            )}

            
            <hr className={styles.summarySeparator}/>

            <p className={styles.subtotal}>Subtotal ({cart.products.length} items): <span>${subtotal.toFixed(2)}</span></p>
            <button onClick={()=> console.log( "Peso total: ", peso )}> PESO </button>
            <button onClick={handleCheckout} className={styles.checkoutButton} disabled={sinStock}>Ir al Checkout</button>
            <button onClick={clearCart} className={styles.clearCartButton}>Vaciar Carrito</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;