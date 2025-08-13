import { Carousel } from 'react-bootstrap';
import Styles from './Banner.module.css';
import { useEffect, useState } from 'react';
import type { Product } from '../../types';
import axios from 'axios';
import { URL } from '../../types/constants';

const Banner: React.FC = () =>
{
    const [ banners, setBanners ] = useState<Product[]>( [] );

    useEffect( () =>
    {
        //lamada para buscar los banners.
    }, [])

    return(
    <div className={Styles.allCarrusel}>
        
        <Carousel interval={2000} pause="hover">
          {banners.map((item, index) => (
            <Carousel.Item key={index}>
              <img src={item.imageUrl[0]} alt={item.name} />
              <Carousel.Caption>
                <h3>{item.name}</h3>
                <button onClick={()=>console.log(item)}> INFO </button>
                <p>{item.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      
    </div>
    )
}

export default Banner;