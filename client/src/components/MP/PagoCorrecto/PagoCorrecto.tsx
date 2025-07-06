import { LOCAL_URL } from "../../../types/constants";

const PagoCorrecto: React.FC = () =>
{

    return(
        <div>
            ¡Gracias por su compra!
            <button onClick={()=>console.log(localStorage.getItem('cartId'))}> carrito </button>
            <button onClick={()=>localStorage.removeItem('cartId')}> borrar carrito </button>
            <button onClick={()=>window.location.replace(`${LOCAL_URL}home`)}> a casita </button>
        </div>
    )
}

export default PagoCorrecto;