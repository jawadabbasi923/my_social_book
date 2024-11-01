// routes/userRoutes.js
import express from 'express';
import {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    followUser,
    unfollowUser,
} from '../../modules/user/controller/user_controller.js';
import authMiddleware from '../../modules/user/middleware/user_middleware.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected routes (requires auth middleware)
userRouter.get('/:id', authMiddleware, getUser);
userRouter.put('/:id', authMiddleware, updateUser);
userRouter.post('/:id/follow', authMiddleware, followUser);
userRouter.post('/:id/unfollow', authMiddleware, unfollowUser);

export default userRouter;
