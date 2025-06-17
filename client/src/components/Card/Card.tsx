// import { useState } from "react";
import { Link } from "react-router-dom";
import type { CardProps } from '../../types/index';
import Styles from "./Card.module.css";

const Card: React.FC<CardProps> = ( { product } ) =>
{

    // const [quantity, setQuantity] = useState(1);

//     const handleBuy = async () =>
//     {
//         if (JSON.parse(window.localStorage.getItem("activeCarrito")) == null)
//         {
//             const carrito = await handleCarrito({
//         id: prop.id,
//         type: type == "Shoe" || type == "Shirt" ? "indId" : "fitId",
//         price: prop.price,
//         img: prop.image,
//         name: prop.name,
//         quantity: quantity,
//       });
//       window.localStorage.setItem("activeCarrito", JSON.stringify(carrito.id));
//     } else {
//       const carrito = await handleCarrito({
//         carritoId: JSON.parse(window.localStorage.getItem("activeCarrito")),
//         id: prop.id,
//         type: type == "Shoe" || type == "Shirt" ? "indId" : "fitId",
//         price: prop.price,
//         img: prop.image,
//         name: prop.name,
//         quantity: quantity,
//       });
//     }
//   };

  return (
    <div className={Styles.cardContainer}>
        <div className={Styles.card}>

          <div className={Styles.imgContainer}>
            <div className={Styles.imgCard}>
                <Link className={Styles.link} to={`/detail/${product.id}`}>
                    <img
                    className={Styles.Img}
                    src={product.image}
                    alt="Imagen del producto"
                    />
                </Link>
            </div>
          </div>

          <div className={Styles.InfoContainer}>
            <h3 className={Styles.title}>{product.name}</h3>
            <h4 className={Styles.price}>$ {product.price}</h4>
          </div>
        </div>
    </div>
  );
};

export default Card;