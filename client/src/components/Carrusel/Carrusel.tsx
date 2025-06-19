import Card from '../Card/Card';
import type { Product } from '../../types';
import './Carrusel.css';
import React from 'react';

interface CarruselProps
{
    products: Product[]
}
const Carrusel: React.FC<CarruselProps> = ( { products } ) =>
{
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300, // Ajusta este valor según el ancho de tus tarjetas + margen
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300, // Ajusta este valor según el ancho de tus tarjetas + margen
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="carousel-wrapper"> {/* Contenedor para el carrusel completo con flechas */}
      <h2>Productos Destacados</h2>
      <div className="carousel-controls">
        <button onClick={scrollLeft} className="carousel-arrow left">&lt;</button>
        <div className="carousel-container" ref={scrollContainerRef}>
          {products.map(product => (
            <div key={product.id} className="carousel-card-item">
              <Card product={product} /> {/* Pasa la data a tu CardComponent */}
            </div>
          ))}
        </div>
        <button onClick={scrollRight} className="carousel-arrow right">&gt;</button>
      </div>
    </div>
  );
};

export default Carrusel;