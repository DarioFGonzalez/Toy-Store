import Styles from './TopBar.module.css';

const TopBar: React.FC = () =>
{

    return(
        <div className={Styles.topBarFixed}>
            <a href='/home'> <button> Home </button> </a>
            <a href='/shop'> <button> SHOP </button> </a>
            <a href='/create'> <button> CREAR </button> </a>
        </div>
    )
}

export default TopBar;