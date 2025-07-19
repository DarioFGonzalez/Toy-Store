import { Link } from 'react-router-dom';
import Styles from './TopBar.module.css';

const TopBar: React.FC = () =>
{

    return(
        <div className={Styles.topBarFixed}>
            <Link className={Styles.link} to={'/home'}>
                <button> Home </button>
            </Link>

            <Link className={Styles.link} to={'/shop'}>
                <button> SHOP </button>
            </Link>

            <Link className={Styles.link} to={'/carrito'}>
                <button> Carrito </button>
            </Link>
        </div>
    )
}

export default TopBar;