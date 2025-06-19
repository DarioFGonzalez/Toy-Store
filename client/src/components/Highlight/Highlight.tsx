import type { Product } from "../../types";
import Card from "../Card/Card";
import './Highlight.css';

interface HighLightProps
{
    items: Product[]
}

const Highlight: React.FC<HighLightProps> = ( {items} ) =>
{

    return(
        <div className='gridWrapper'>
            <div className="productGridContainer">

                { items?.map( (item, index) => <Card product={item} key={index} /> ) }

            </div>
        </div>
    )
}

export default Highlight;