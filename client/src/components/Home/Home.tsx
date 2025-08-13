import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import type { Product } from '../../types';
import { URL } from '../../types/constants';
import Styles from "./Home.module.css";
import Highlights from '../Highlights/Highlights';

const Home: React.FC = () =>
{
  const [entries, setEntries] = useState<Product[]>([]);

  useEffect(() => {
    axios.get(`${URL}product?highlighted=true`)
      .then(({ data }) => {
        setEntries(data.slice(0, 4));
      })
      .catch((error) => {
        console.log("Error al traer las entries: ", error);
      });
  }, []);

  return (
    <div className={Styles.homeContainer}>
      
      <div className={Styles.allCarrusel}>
        
        <Carousel interval={2000} pause="hover">
          {entries.map((item, index) => (
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

      <Highlights />
    
    </div>
  );
};

export default Home;