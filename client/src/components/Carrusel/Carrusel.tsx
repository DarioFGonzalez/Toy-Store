import Card from '../Card/Card';
import type { CarruselProps } from '../../types/index';
import './Carrusel.css';
import React from 'react';


const Carrusel: React.FC<CarruselProps> = ( { products } ) =>
{
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

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
          {products.map(product => (
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

export default Carrusel;