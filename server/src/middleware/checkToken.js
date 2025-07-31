const jwt = require('jsonwebtoken');

const verifyToken = ( req, res, next ) =>
{
    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).json( {error_authMiddleware: 'Header missing' } );
    
    const headerParts = authHeader.split(' ');
    if(headerParts.length!==2 || headerParts[0]!=='Bearer') return res.status(401).json( {error_authMiddleware: 'Invalid header format' } );
    
    const token = headerParts[1];
    
    try
    {
        const decoded = jwt.verify( token, process.env.SECRET_WORD );
        next();
    }
    catch(error)
    {
        console.error( `General error authMidd: ${error}` );
        return res.status(401).json( { generalError_authMiddleware: `Invalid or expired token` } );
    }
}

module.exports = verifyToken;