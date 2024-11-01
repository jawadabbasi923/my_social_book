import express from 'express';
import connectDB from './src/core/connection/mongo_connection.js';
import dotenv from 'dotenv';
import staticRoute from './src/core/router/static_routes.js';
import userRouter from './src/core/router/user_route.js'

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use('/', staticRoute)
app.use('/api/user', userRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

