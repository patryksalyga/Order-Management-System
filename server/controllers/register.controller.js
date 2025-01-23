const User = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const Role = require('../models/role.model');

const handleNewUser = async (req, res) => {
    const { usr, pwd, mail, num } = req.body;
    let role = await Role.findOne({ name: "USER" });

    if (pwd.length < 5){
        return res.status(409).json({ "message": 'Minimum 5 characters password' });
    }

    const duplicateUsername = await User.findOne({ username: usr });
    if (duplicateUsername) {
        return res.status(409).json({ "message": 'User already exists' });
    }

    const duplicateEmail = await User.findOne({ email: mail });
    if (duplicateEmail) {
        return res.status(409).json({ "message": 'Email already has an account' });
    }


    const duplicateNumber = await User.findOne({ phoneNumber: num });
    if (duplicateNumber) {
        return res.status(409).json({ "message": 'Number already has an account' });
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);

        const newUser = new User({
            username: usr,
            password: hashedPwd,
            email: mail,
            phoneNumber: num,
            role: role._id 
        });

        await newUser.save();

        res.status(201).json({ message: "User added successfully", user: newUser });
    } catch (error) {
        res.status(500).json({ "message": error.message });
    }
};

module.exports = {
    handleNewUser
};
