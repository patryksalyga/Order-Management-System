const Status = require('../models/status.model');

const getStatuses = async (req, res) => {
    try{
        const stasuses = await Status.find({});
        res.status(200).json(stasuses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const getStatusById = async (req, res) => {
    try{
        const {id} = req.params;
        const status = await Status.findById(id);

        if(!status){
            return res.status(404).json({message: "Status not found"});
        }

        res.status(200).json(status);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

module.exports = {
    getStatuses,
    getStatusById
}