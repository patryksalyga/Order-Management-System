const User = require('../models/user.model.js')

const handleLogout = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt){
        return res.sendStatus(204);
    }
    
    const foundToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken: foundToken });


    if(!foundUser){
        res.clearCookie('jwt',{ httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000 });
        return res.status(403);
    }

    foundUser.refreshToken = '';
    await foundUser.save();

    res.clearCookie('jwt',{ httpOnly: true, sameSite: 'None', secure: true, maxAge: 24*60*60*1000 });
    res.sendStatus(204);
};

module.exports = {
    handleLogout
}