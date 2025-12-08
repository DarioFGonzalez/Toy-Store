const axios = require('axios');
const pudoTokenManager = require('../services/PudoTokenManager');
const { TRACKING_URL, LABEL_URL } = require('./pudoApiConfig');

const getTrackingNumber= async ( id ) =>
{
    const headerObject = await pudoTokenManager.getValidHeader();
    
    try
    {
        const { data } = await axios.get(TRACKING_URL+id, headerObject);

        return data;
    }
    catch( err )
    {
        console.error( err );
        throw new Error( `Error al obtener trackingUrl: ${err.message}` );
    }
}

const getLabelPdf = async ( id ) =>
{
    const headerObject = await pudoTokenManager.getValidHeader();

    try
    {
        const { data } = await axios.get(LABEL_URL+id,
        { ...headerObject, responseType: 'arraybuffer'} );

        return data;
    }
    catch (err)
    {
        let errorMessage = err.message;
        if(err.response && err.response.data)
        {
             errorMessage = err.response.data.toString('utf8');
        }

        console.error("Error en getLabelPdf:", errorMessage);
        
        throw new Error( `Error al conseguir el labelPdf: ${errorMessage}` );
    }
}

module.exports = { getLabelPdf, getTrackingNumber };