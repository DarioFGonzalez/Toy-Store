import { Link } from "react-router-dom";
import type { CardProps } from '../../types/index';
import Styles from "./Card.module.css";

const Card: React.FC<CardProps> = ( { product } ) =>
{
  const toThumbnail = ( url: string ): string =>
  {
    const thumbnailUrl = "/upload/h_250,w_250,f_auto,q_auto/";
    const toThumbnailUrl = url.replace( '/upload/', thumbnailUrl );

    return toThumbnailUrl;
  }

  return (
    <div className={Styles.cardContainer}>
        <div className={Styles.card}>

          <div className={Styles.imgContainer}>
            <div className={Styles.imgCard} >
                <Link className={Styles.link} to={`/detail/${product.id}`}>
                    <img
                    className={Styles.Img}
                    src={toThumbnail(product.imageUrl[0].url)}
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