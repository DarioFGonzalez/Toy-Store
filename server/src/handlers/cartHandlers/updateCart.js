const { CartItem, Carts, Products } = require('../../db/db');

const updateCart = async ( req, res ) =>
{
    const { id } = req.params;
    const { productId, quantity } = req.body;

    try
    {
        const thisCart = await Carts.findByPk( id, { include:
            [
                {
                    model: Products,
                    as: 'products',
                    attributes: [ 'id', 'name', 'description', 'category', 'price', 'imageUrl', 'stock' ],
                    through: { attributes: ['quantity', 'priceAtAddition'] }
                }
            ]
        } );

        const itemInCart = thisCart.products.find( item => item.id === productId );

        if(itemInCart)
        {
            if(Number(quantity)==0)
            {
                const deleted = await CartItem.destroy( { where: { cartId: id, productId: productId } } );

                const thisCartUpdated = await thisCart.reload( { include:
                [
                    {
                        model: Products,
                        as: 'products',
                        attributes: [ 'id', 'name', 'description', 'category', 'price', 'imageUrl', 'stock' ],
                        through: { attributes: ['quantity', 'priceAtAddition'] }
                    }
                ] } );

                return res.status(200).json( thisCartUpdated );
            }

            const [ updatedRows, updatedData ] = await CartItem.update( { quantity: quantity },
            { where: { cartId: id, productId: productId }, returning: true } );

            if(!updatedRows) throw new Error( `Error al actualizar el carrito` );

            const thisCartUpdated = await thisCart.reload( { include:
                [
                    {
                        model: Products,
                        as: 'products',
                        attributes: [ 'id', 'name', 'description', 'category', 'price', 'imageUrl', 'stock' ],
                        through: { attributes: ['quantity', 'priceAtAddition'] }
                    }
                ]
            } );

            return res.status(200).json( thisCartUpdated );
        }

        const thisProduct = await Products.findByPk( productId );

        await thisCart.addProduct( thisProduct, { through: { quantity: quantity, category, priceAtAddition: thisProduct.price } } );

        const thisCartUpdated = await thisCart.reload( { include:
            [
                {
                    model: Products,
                    as: 'products',
                    attributes: [ 'id', 'name', 'description', 'category', 'price', 'imageUrl', 'stock' ],
                    through: { attributes: ['quantity', 'priceAtAddition'] }
                }
            ]
        } );
        
        return res.status(200).json( thisCartUpdated );
    }
    catch( err )
    {
        console.error( err );
        return res.status(500).json( { updateCart: err.message } );
    }
}

module.exports = updateCart;