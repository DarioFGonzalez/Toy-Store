import type { Product } from "../../types";
import Card from "../Card/Card";
import './Products.css';

interface HighLightProps
{
    items: Product[]
}

const Products: React.FC<HighLightProps> = ( {items} ) =>
{

    return(
        <div className='gridWrapper'>
            <div className="productGridContainer">

                { items?.map( (item, index) => (item.visible && <Card product={item} key={index} />) ) }

            </div>
        </div>
    )
}

export default Products;