import axios from "axios";
import { URL, LOCAL_URL } from "../../types/constants";

const MP: React.FC = () =>
{
    const handleWebhook = ( status: string ): void =>
    {
        const cartId = localStorage.getItem('cartId');
        if( cartId )
        {
            axios.patch(`${URL}checkout`, { externalReference: JSON.parse(cartId), status: status } )
            .then( () =>
            {
                console.log( '¡Tomada!' );
                window.location.replace(`${LOCAL_URL}success`);
            })
            .catch( ( err ) =>
            {
                console.error( err )
                window.location.replace(`${LOCAL_URL}failure`)
            });
        }
    }

    return(
        <div>
            <button onClick={()=>handleWebhook('success')}> PAGO SATISFACTORIO </button>
            <button onClick={()=>handleWebhook('failed')}> PAGO FRACASADO </button>
        </div>
    )
}

export default MP;