import { useLocation, useNavigate } from 'react-router-dom';
import type { PaginadoProps } from '../../types/index';

const Paginado: React.FC<PaginadoProps> = ( { totalPages, currentPage }) =>
{
    const navigate = useNavigate();
    const location = useLocation();
    const paginas = Array.from( { length: totalPages }, (_, i) => i + 1 );

    const swapPage = ( page: number ): void =>
    {
        const params = new URLSearchParams(location.search);

        params.set('page', page.toString());

        navigate(`${location.pathname}?${params.toString()}`);
    }

    return(
        <div>
            {paginas.map( page => (
                <button
                    key={page} // ¡Es importante para React cuando mapeas elementos!
                    onClick={() => swapPage(page)} // Llama a swapPage con el número de página
                    style={ {
                        color: currentPage === page ? 'red' : 'black', // Resalta la página actual
                        fontWeight: currentPage === page ? 'bold' : 'normal',
                        margin: '0 5px', // Pequeño margen entre botones
                        cursor: 'pointer',
                        background: 'none',
                        border: 'none',
                        padding: '5px 10px'
                    }}
                >
                    {page}
                </button>
            ))}
        </div>
    )
}

export default Paginado;