import express from 'express';

const staticRoute = express.Router()

staticRoute.get('/', (req, res) => {
    return res.send('Welcome to Home Page');
})

export default staticRoute;