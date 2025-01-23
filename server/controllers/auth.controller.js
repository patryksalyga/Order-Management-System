const User = require('../models/user.model.js')
const Role = require('../models/role.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const {usr, pwd} = req.body;

    if (!usr || !pwd){
        return res.status(400).json({message: 'Username and password are required'})
    }

    const foundUser = await User.findOne({ username: usr });


    if(!foundUser){
        return res.status(401).json({message: 'Username not found'})
    }

    const match = await bcrypt.compare(pwd, foundUser.password);

    if(match){
        const accessToken = jwt.sign(
            { "username": foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '3600m' } //ZWIEKSZYC
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        foundUser.refreshToken = refreshToken;
        await foundUser.save();

        const foundRole = await Role.findOne({ _id: foundUser.role });

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None',  maxAge: 24*60*60*1000});

        res.json({message: 'Success', accessToken: accessToken, id: foundUser._id, role: foundRole.name})
    }else{
        res.status(401).json({message: 'Incorrect password'})
    }
}

module.exports = {
    handleLogin
}