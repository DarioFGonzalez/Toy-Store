const { Products } = require('../../db/db');

const fillUp = async ( req, res ) =>
{
    const allDummies =
    [
        {
            name: "Vaso de madera",
            description: "Un vaso de madera.",
            price: 666.99,
            category: "peluche",
            stock: 100
        },
        {
            name: "Juguete de madera",
            description: "Un juguete de madera.",
            price: 196.99,
            category: "peluche",
            stock: 100
        },
        {
            name: "Juego de mesa",
            description: "Un Juego de mesa.",
            price: 1000.69,
            category: "juego de mesa",
            stock: 100
        },
        {
            name: "Muñeco de felpa",
            description: "Un Muñeco de felpa.",
            price: 43000.00,
            category: "muñeco",
            stock: 100
        },
        {
            name: "Un alien con orejas",
            description: "Un juguete extraño, dificil de catalogar.",
            price: 420.13,
            category: "otros",
            stock: 100
        },
        {
            name: "Un UNO con orejas",
            description: "Un juguete aún MÁS extraño, dificil de catalogar.",
            price: 1111.11,
            category: "otros",
            stock: 1
        },
        {
            name: "DAMAS",
            description: "Clásico juego de DAMAS.",
            price: 2500.75,
            category: "juego de mesa",
            stock: 50
        },
        {
            name: "Chucky",
            description: "Muñeco de Chucky.",
            price: 1020.00,
            category: "muñeco",
            stock: 100
        },
        {
            name: "Peluche de Frotzo",
            description: "Nadie compra este peluche, se escucha como algo rompiendose.",
            price: 1.00,
            category: "peluche",
            stock: 1000
        },
        {
            name: "???",
            description: "Unknown, anon, undefined, null, etc.",
            price: 9999.00,
            category: "otros",
            stock: 1000
        }
    ]

    try
    {
        await Products.bulkCreate( allDummies );
    
        return res.status(200).json( { success: 'Servidor lleno de dummies' } );
    }
    catch(error)
    {
        console.error(error);
        return res.status(500).json( { fillUp: error.message } );
    }
}

module.exports = fillUp;