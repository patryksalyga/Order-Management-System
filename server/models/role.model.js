const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter a role name"],
            unique: true
        }
    },
);

const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;
