import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Styles from "./Home.module.css";
import { URL } from '../../types/constants';
import type { Product } from '../../types';
import Carrusel from '../Carrusel/Carrusel';

const Home: React.FC = () =>
{
  const navigate = useNavigate();

  const [ entries, setEntries ] = useState<Product[]>([]);
  const [ all, setAll ] = useState<Product[]>([]);

  useEffect( () =>
  {
    axios.get(`${URL}product`)
    .then( ( { data } ) =>
    {
      setEntries(data.slice(0,4));
      setAll( data );
    })
    .catch( ( error ) =>
    {
      console.log("Error al traer las entries: ", error);
    })
  }, [])
  
  return (

  <div className={Styles.homeContainer}>

    <div>
      <div className={Styles.allCarrusel}>
        <div>

          <Carousel interval={2000} pause="hover">

            {entries.map((item, index) => (
            <Carousel.Item key={index}>
                <img src={item.image} alt={item.name} />
                <Carousel.Caption>
                  <h3> {item.name} </h3>
                  <p> {item.description} </p>
                </Carousel.Caption>
            </Carousel.Item>
            ))}

          </Carousel>

        </div>
      </div>
    </div>

    <Carrusel products={all} />

  </div>
  );
};

export default Home;

/*import axios from 'axios';
import React, { useEffect, useState } from 'react';
import type { Product } from '../../types/index';
import Card from '../Card/Card';

const Home: React.FC = () =>
{
    const [ data, setData ] = useState<Product[]>( [] );

    useEffect( () =>
    {
        axios.get(`http://localhost:5000/product`)
        .then( ( {data} ) =>
        {
            setData(data)
        } )
        .catch( ( err ) => { console.log( err ) } );
    }, [] );

    return(
        <div>
            Soy el home
            {data.map( (item, y) =>
                <Card key={y} product={item} />
            ) }
        </div>
    )
}

export default Home;*/