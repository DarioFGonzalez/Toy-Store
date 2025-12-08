import React, { useState, useEffect } from 'react';
import styles from './Carrito.module.css';
import type { Cart, ContactInfo, MapaDePesos, ProductInCart,
  NormalizedProduct, DestinationLocker , CategoriasJoyeria, FinalDbOrder } from '../../types';
import axios from 'axios';
import { emptyCart, emptyContactInfo, destinationLockerInfo, URL,
  packageMeasures } from '../../types/constants';
import { PudoSelectionMap } from './PudoSelectionMap/PudoSelectionMap';

const Carrito: React.FC = () =>
{
    const [cart, setCart] = useState<Cart>( emptyCart );
    const [ form, setForm ] = useState<ContactInfo>( emptyContactInfo );
    const [ normalizedProducts, setNormalizedProducts ] = useState<NormalizedProduct[]>( [] ); 
    const [ destinationLocker, setDestinationLocker ] = useState<DestinationLocker>( destinationLockerInfo );
    const [ quoteAnswer, setQuoteAnswer ] = useState<any>( );
    const [ chooseLocker, setChooseLocker ] = useState<boolean>( false );
    const [ confirmPurchase, setConfirmPurchase ] = useState<boolean>( false );
    const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{2,}\.(com|es|ar)$/;
    const [ wrongEmail, setWrongEmail ] = useState<boolean>( false );
    const [ noName, setNoName ] = useState<boolean>( false );
    const [ noNumber, setNoNumber ] = useState<boolean>( false );
    const [sinStock, setSinStock] = useState<boolean>( false );
    const [subtotal, setSubtotal] = useState(0);

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
    let pudoInfo = createFinalOrder();

    if(!pudoInfo) return ;

    axios.post(`${URL}checkout`, {cart, pudoInfo}).then( ( { data } ) =>
    {
      alert( `deberías habersido redirigido a : ${data}` );
      // alert('¡Gracias por su compra!');
      // window.location.replace(data);
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

  const normalizeCartItems = () =>
  {
    let products: NormalizedProduct[] = cart.products.map( item =>
    ({
      sku: item.id,
      name: item.name,
      price: item.price,
      widthInMm: 10,
      heightInMm: 10,
      depthInMm: 10,
      weightInGrams: pesoPorItem[item.category as CategoriasJoyeria] * item.CartItem.quantity,
      quantity: item.CartItem.quantity,
      freeShipping: false
    }) );

    setNormalizedProducts( products );
    setChooseLocker( true );

  }

  const pedirPresupuesto = async () =>
  {
    const cotizationBody = { destination: destinationLocker.destination, items: normalizedProducts };

    axios.post(`${URL}pudo/quote`, cotizationBody )
    .then( ( res ) =>
      {
        res?.data.forEach( (x: any) =>
          {
            if(x.shippingMethodId===1)
            {
              x.options.find( (locker: any) => locker.lockerId === destinationLocker.lockerId && setDestinationLocker( prev =>
              ({
                ...prev,
                city: locker.city.trim(),
                province: locker.province.trim()
              }) ) )
              setDestinationLocker( prev => ( {...prev, price: x.price.toFixed(2) } ) )
              setConfirmPurchase( true );
            }
          } )
      } )
    .catch( ( err ) => console.error( err ) );
  }

  const createFinalOrder = (): FinalDbOrder | false =>
  {
    if( form.name!='' && form.phoneNumber!='' && emailRegex.test(form.mail) )
    {
      const timestamp = Date.now().toString();
      const randomSuffix = Math.floor(Math.random() * 900) + 100;
      const uniqueIdString = timestamp + randomSuffix.toString();
      const finalOrderId = uniqueIdString.substring(0, 16);

      console.log(
        {
          platformOrderId: finalOrderId,
          platformOrderNumber: finalOrderId,
          
          internalCartId: cart.id,
          
          customer: form,
          
          shippingInfo: { ...destinationLocker, price: destinationLocker.price },
          
          createReserve: true,
          
          metrics: {...packageMeasures, weightInGrams: cart.products.reduce( ( acc, x ) =>
            acc + pesoPorItem[x.category as CategoriasJoyeria] * x.CartItem.quantity, 0 ) },
          
          items: normalizedProducts
        }
      );

      return(
        {
          platformOrderId: finalOrderId,
          platformOrderNumber: finalOrderId,
          
          internalCartId: cart.id,
          
          customer: form,
          
          shippingInfo: { ...destinationLocker, price: destinationLocker.price },
          
          createReserve: true,
          
          metrics: {...packageMeasures, weightInGrams: cart.products.reduce( ( acc, x ) =>
            acc + pesoPorItem[x.category as CategoriasJoyeria] * x.CartItem.quantity, 0 ) },
          
          items: normalizedProducts
        }
      )
    }

    setNoName( form.name == '' );
    setWrongEmail( emailRegex.test(form.mail) )
    setNoNumber( form.phoneNumber == '' );

    return false;
  }

  const postOrder = async () =>
  {
    const res = await axios.post( `${URL}pudo/order/${cart.id}`);
    if(!res) console.log('Algo falló al postear la order: ', res );
    console.log( "Respuesta del postOrder: ", res );
  }

  const fetchOrder = async () =>
  {
    const res = await axios.get(`${URL}pudo/orders/${cart.id}`);
    setQuoteAnswer( res );
    console.log( res );
  }

  const showTotal = (): number | string =>
  {
    if(destinationLocker.price)
    {
      const priceToNumber = parseInt(destinationLocker.price);
      const total = priceToNumber + subtotal;

      return total;
    }

    return 'Falta el presupuesto';
  }

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Carrito de Compras</h1>

      {cart.products.length === 0
      ? ( <p className={styles.emptyCartMessage}>Tu carrito está vacío.</p> )
      : (
        <>
          { !chooseLocker && (<div>
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

            <div className={styles.shippingToggle}>
              <label htmlFor="showShippingInfo">¡Carrito listo para la parte del envío!</label>
              <input type='checkbox' id="showShippingInfo" onClick={normalizeCartItems}/>
            </div>
          </div>) }

            <div className={styles.cartSummary}>

            { ( chooseLocker && !confirmPurchase ) && (
              <>
                <PudoSelectionMap key={chooseLocker.toString()} setDestinationLocker={ setDestinationLocker } />
                <button disabled={destinationLocker.lockerId===0} onClick={ pedirPresupuesto }> Pedir cotizatión </button>
                <button onClick={()=>console.log(destinationLocker)}> locker elegido </button>

              </>
            )}

            { confirmPurchase && 
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
                  <label htmlFor="Mail">Email:</label>
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
                <button onClick={()=>console.log(form)}> form </button>
              </div>
            }

            
            <hr className={styles.summarySeparator}/>

            <p className={styles.subtotal}>Subtotal ({cart.products.length} items): <span>${subtotal.toFixed(2)}</span></p>
            <p className={styles.itemSubtotal}>Envío: ${destinationLocker.price}</p>
            <p className={styles.itemSubtotal}>Total a pagar: { showTotal() }</p>
            
            <button onClick={()=>createFinalOrder()}> Orden final </button>
            { confirmPurchase && <button onClick={postOrder}> POST ORDER </button>}
            { confirmPurchase && <button onClick={fetchOrder}> Orden relacionada al carrito </button> }
            <button onClick={()=>console.log((quoteAnswer))}> quoteAnswer </button>
            <button onClick={handleCheckout} className={styles.checkoutButton} disabled={sinStock}>Ir al Checkout</button>
            <button onClick={clearCart} className={styles.clearCartButton}>Vaciar Carrito</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Carrito;