import { Carousel } from 'react-bootstrap';
import Styles from './Banner.module.css';
import { useEffect, useState } from 'react';
import type { Banner } from '../../types';
import axios from 'axios';
import { URL } from '../../types/constants';

const Banners: React.FC = () =>
{
    const [ banners, setBanners ] = useState<Banner[]>( [] );

    useEffect( () =>
    {
        axios.get(`${URL}banner?active=true`)
        .then( ( { data } ) => setBanners( data ) )
        .catch( ( err ) => console.log( err ) );
    }, [])

    return(
    <div className={Styles.allCarrusel}>
        
        <Carousel interval={2000} pause="hover" slide={false}>
          {banners.map((item, index) => (
            <Carousel.Item key={index}>
              <img src={item.imageUrl.url} alt={item.category} onClick={()=>console.log(item)}/>
            </Carousel.Item>
          ))}
        </Carousel>
      
    </div>
    )
}

export default Banners;