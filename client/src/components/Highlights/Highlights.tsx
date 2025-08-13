import axios from 'axios';
import type { Product } from '../../types';
import Card from '../Card/Card';
import './Highlights.css';
import React, { useEffect, useState } from 'react';
import { URL } from '../../types/constants';


const Highlights: React.FC = () =>
{
  const [ highlighted, setHighlighted ] = useState<Product[]>( [] );
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect( () =>
  {
    axios.get(`${URL}product?highlighted=true`)
    .then( ( { data } ) => setHighlighted( data ) )
    .catch( ( err ) => console.log( err ) );
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="carousel-wrapper"> 
      <h2>Productos Destacados</h2>
      <div className="carousel-controls">
        <button onClick={scrollLeft} className="carousel-arrow left">&lt;</button>
        <div className="carousel-container" ref={scrollContainerRef}>
          {highlighted.map(product => (
            <div key={product.id} className="carousel-card-item">
              <Card product={product} />
            </div>
          ))}
        </div>
        <button onClick={scrollRight} className="carousel-arrow right">&gt;</button>
      </div>
    </div>
  );
};

export default Highlights;