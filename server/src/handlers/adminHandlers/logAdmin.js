const jwt = require('jsonwebtoken');

const logAdmin = async ( req, res ) =>
{
    const { password } = req.body;
    
    if(password === process.env.ADMIN_SECRET)
    {
        const JWT_SECRET = process.env.SECRET_WORD;
        const payload =
        {
            role: 'admin'
        }

        const options =
        {
            expiresIn: '1d',
            audience: "Violeta's TOY STORE"
        }

        const token = jwt.sign(payload, JWT_SECRET, options);

        return res.status(200).json( { token: token } );
    }
    return res.status(400).json( { error: 'Contraseña incorrecta' } );
}

module.exports = logAdmin;