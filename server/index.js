const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const cors = require('cors');
const productRoute = require('./routes/product.route.js')
const categoryRoute = require('./routes/category.route.js')
const statusRoute = require('./routes/status.route.js')
const orderRoute = require('./routes/order.route.js')
const registerRoute = require('./routes/register.route.js')
const authRoute = require('./routes/auth.route.js')
const refreshRoute = require('./routes/refresh.route.js')
const seedOrderStatuses = require('./seeders/seedStatuses');
const seedRoles = require('./seeders/seedRoles.js')
const verifyJWT = require('./middleware/verifyJWT.js');
const cookieParser  = require('cookie-parser');
const credentials = require('./middleware/credentials.js');
const corsOptions = require('./config/corsOptions.js');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(credentials);
app.use(cors(corsOptions));

app.use(cookieParser());

app.use("/api/register", registerRoute);
app.use("/api/auth", authRoute);
app.use("/api/refresh", refreshRoute);
app.use("/api/logout", require('./routes/logout.route.js'));

app.use(verifyJWT);

app.use("/api/init", require('./routes/init.route.js'));
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/statuses", statusRoute);
app.use("/api/orders", orderRoute);

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to database');
        await seedOrderStatuses();
        await seedRoles();
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch(() => {
        console.log('Connection failed');
    });



