const Role = require('../models/role.model.js');

const seedRoles = async () => {
    const roles = ["USER", "EMPLOYEE"];

    try {
        const existingRoles = await Role.find({});
        if (existingRoles.length === 0) {
            const rolesDoc = roles.map(role => ({ name: role }));
            await Role.insertMany(rolesDoc);
            console.log("Roles seeded successfully");
        } else {
            console.log("Roles already exist");
        }
    } catch (error) {
        console.error("Error seeding order statuses:", error.message);
    }
};

module.exports = seedRoles;
