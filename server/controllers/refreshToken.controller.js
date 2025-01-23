const User = require('../models/user.model.js')
const jwt = require('jsonwebtoken')

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt){
        return res.sendStatus(401);
    }
    
    const foundToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken: foundToken });


    if(!foundUser){
        return res.status(403);
    }

    jwt.verify(
        foundToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username){
                return res.sendStatus(403);
            }
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' } //ZWIEKSZYC
            );
            res.json({accessToken})
        }
    )
};

module.exports = {
    handleRefreshToken
}