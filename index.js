import express from 'express';
import staticRoute from './src/core/router/static_routes.js';
import Constants from './src/core/helper/constants.js'

const app = express();

app.use('/', staticRoute)

app.listen(Constants.PORT, () => console.log('Server Connected!'))