import express from 'express';
import staticRoute from './src/core/router/static_routes.js';
import Constants from './src/core/helper/constants.js'
import connectDB from './src/core/connection/mongo_connection.js';

const app = express();
connectDB();
app.use(express.json());

app.use('/', staticRoute)

app.listen(Constants.PORT, () => console.log('Server Connected!'))