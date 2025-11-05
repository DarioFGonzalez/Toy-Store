const axios = require('axios');
const { QUOTE_URL } = require('../../config/pudoApiConfig');
const pudoTokenManager = require('../../services/PudoTokenManager');

const postQuote = async ( req, res ) =>
{
    const packageInfo = req.body;
    
    try
    {
        const header = await pudoTokenManager.getValidHeader();
        const response = await axios.post( QUOTE_URL, packageInfo, header );

        return res.status(200).json( response.data );
    }
    catch( err )
    {
        const statusError = err.response?.status || '500';

        const errorData = err.response?.data;

        const errorMessage =
        errorData?.message ||
        errorData?.error ||
        errorData?.details ||
        err.message;

        console.error( err );

        return res.status(statusError).json( { postCotization: errorMessage } );
    }
}

module.exports = postQuote;