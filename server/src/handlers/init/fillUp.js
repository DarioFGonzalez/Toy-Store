const { Products } = require('../../db/db');

const fillUp = async ( req, res ) =>
{
    const allDummies =
    [
        {
            name: "Collar de madera",
            description: "Un collar de madera.",
            price: 6.99,
            category: "collares",
            material: 'madera',
            medidas: '30',
            stock: 100
        },
        {
            name: "Aros de Fundición",
            description: "Hermosos aros color plateado de fundición, preciosos con ropa a juego.",
            price: 1.45,
            category: "aros",
            meterial: 'fundicion',
            medidas: '40',
            stock: 100
        },
        {
            name: "Anillo de acero quirúrgico importado",
            description: "Delicados anillos de acero quirúrgico, colección invierno cálido.",
            price: 1.69,
            category: "anillos",
            material: 'acero quirurgico',
            medidas: '50',
            stock: 100
        },
        {
            name: "Cadenita de Cristal checo rosado",
            description: "Una delicada cadenita de cristal checo color rosado suave, femenina, delicada, preciosa.",
            price: 1.95,
            category: "cadenitas",
            material: 'cristal checo',
            medidas: '60',
            stock: 100
        },
        {
            name: "Choker gótico",
            description: "Choker estil Gótico con detalles rojos.",
            price: 1.05,
            category: "chokers",
            material: 'hilo encerado',
            medidas: '70',
            stock: 100
        },
        {
            name: "Collar de mostacillas",
            description: "Divertido collar hecho enteramente de mostacillas, color amarillo, largo.",
            price: 0.75,
            category: "collares",
            material: 'mostacillas',
            medidas: '80',
            stock: 5
        },
        {
            name: "Gargantilla de perlas",
            description: "Delicada gargantilla de perlas de vidrio.",
            price: 1.25,
            category: "gargantillas",
            material: 'perlas de vidrio',
            medidas: '90',
            stock: 50
        },
        {
            name: "Pulsera de perlas acrilicas naranja",
            description: ".",
            price: 1.03,
            category: "pulseras",
            material: 'perlas acrilicas',
            stock: 100
        },
        {
            name: "Tobillera de Kristina",
            description: "Vamo' a volvé ✌😭🍺",
            price: 9999.95,
            category: "tobilleras",
            material: 'alambre con memoria',
            stock: 1000
        },
        {
            name: "Pulsera de piedras semipreciosas",
            description: "Decorada con varias piedras semipreciosas de colores vibrantes, ideal para outfits coloridos",
            price: 2.00,
            category: "pulseras",
            material: 'piedras semipreciosas',
            stock: 1000
        },
        {
            name: "Collar estilo selvático",
            description: "Detalles de soga, marrones y toques de selva.",
            price: 1.49,
            category: "collares",
            material: 'tanza de acero',
            medidas: '90',
            stock: 100
        },
        {
            name: "Cadenita elástica FIT",
            description: "Cadenita FIT ideal para running y actividades al aire libre.",
            price: 1.85,
            category: "cadenitas",
            material: "tanza elastica",
            stock: 100
        },
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