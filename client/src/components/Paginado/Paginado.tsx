import { useLocation, useNavigate } from 'react-router-dom';
import type { PaginadoProps } from '../../types/index';
import styles from './Paginado.module.css';

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
        <div className={styles.paginationContainer}>
            {paginas.map( page => (
                <button
                    key={page}
                    onClick={() => swapPage(page)}
                    className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                >
                    {page}
                </button>
            ))}
        </div>
    )
}

export default Paginado;