import axios from 'axios';
import { useEffect, useState } from 'react';
import { Carousel } from 'react-bootstrap';
import type { Banner } from '../../types';
import { URL } from '../../types/constants';
import Styles from './Banner.module.css';

const Banners: React.FC = () =>
{
    const [ banners, setBanners ] = useState<Banner[]>( [] );

    useEffect( () =>
    {
        axios.get(`${URL}banner?active=true`)
        .then( ( { data } ) => setBanners( data ) )
        .catch( ( err ) => console.log( err ) );
    }, [])

    const toBanner = ( url: string): string =>
    {
      const transformedUrl = url.replace('/upload/', '/upload/w_960,h_400,c_fit,f_auto,q_auto/');
      return transformedUrl;
    }

    return(
    <div className={Styles.allCarrusel}>
        
        <Carousel interval={2000} pause="hover" slide={false}>
          {banners.map((item, index) => (
            <Carousel.Item key={index}>
              <img src={toBanner(item.imageUrl.url)} alt={item.category} onClick={()=>console.log(item)}/>
            </Carousel.Item>
          ))}
        </Carousel>
      
    </div>
    )
}

export default Banners;