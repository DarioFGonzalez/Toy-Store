import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import Styles from "./Home.module.css";
import { URL } from '../../types/constants';
import type { Product } from '../../types';
import Carrusel from '../Carrusel/Carrusel';

const Home: React.FC = () => {
  const [entries, setEntries] = useState<Product[]>([]);
  const [all, setAll] = useState<Product[]>([]);

  useEffect(() => {
    axios.get(`${URL}product`)
      .then(({ data }) => {
        setEntries(data.slice(0, 4));
        setAll(data);
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
              <img src={item.image} alt={item.name} />
              <Carousel.Caption>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
      <Carrusel products={all} />
    </div>
  );
};

export default Home;