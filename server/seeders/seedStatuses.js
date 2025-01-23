const OrderStatus = require('../models/status.model.js');

const seedOrderStatuses = async () => {
    const statuses = ["PENDING", "APPROVED", "CANCELLED", "COMPLETED"];

    try {
        const existingStatuses = await OrderStatus.find({});
        if (existingStatuses.length === 0) {
            const statusDocs = statuses.map(status => ({ name: status }));
            await OrderStatus.insertMany(statusDocs);
            console.log("Order statuses seeded successfully");
        } else {
            console.log("Order statuses already exist");
        }
    } catch (error) {
        console.error("Error seeding order statuses:", error.message);
    }
};

module.exports = seedOrderStatuses;
