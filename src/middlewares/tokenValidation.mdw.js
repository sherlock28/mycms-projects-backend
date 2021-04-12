const tokenValidation = (req, res, next) => {
    
    /*Se obtiene el token enviado */
    const token = req.header('Authorization');
    /*Se comprueba que se haya recido el token*/
    if(!token) return res.status(401).json({
        message: 'Access denied'
    });

    try {
        /*Utilizando jwt se verifica el token y se obtiene su contenido */
        const decode = jwt.verify(token, process.env.SECRET_KEY || 'othersecretkey');

        /*Con los datos obtenidos del token se verifica que el mismo
        pertenece al usuario consultando en la db*/
        const user =  await User.findOne({$and: [{_id: decode.user_id}, {token: token}]});
        /*Si la consulta anterio devuelve null significa que el token no pertece al usuario o bien que el usuario no esta logueado y por lo tanto no tiene su token registrado en la db*/
        if(user === null) {
            return res.status(401).json({
                message: 'Access denied'
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
}

module.exports = tokenValidation;