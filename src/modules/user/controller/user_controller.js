import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../model/user_model.js';

export const registerUser = async (req, res) => {
    try {
        const { username, email, password, dateOfBirth, bio, location } = req.body;

        // Check if email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) return res.status(400).json({ message: 'Username or email already exists' });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            dateOfBirth,
            bio,
            location,
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};


export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password field
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error });
    }
};


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, bio, location, profilePicture } = req.body;

        // Update user fields
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, bio, location, profilePicture },
            { new: true }
        ).select('-password'); // Exclude password field
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};


export const followUser = async (req, res) => {
    try {
        const { id } = req.params; // ID of the user to follow
        const userId = req.user.id; // ID of the logged-in user

        // Add user to following list if not already following
        const user = await User.findById(id);
        const currentUser = await User.findById(userId);

        if (!user.followers.includes(userId)) {
            user.followers.push(userId);
            currentUser.following.push(id);
            await user.save();
            await currentUser.save();
            res.json({ message: `You are now following ${user.username}` });
        } else {
            res.status(400).json({ message: 'Already following this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error following user', error });
    }
};


export const unfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const user = await User.findById(id);
        const currentUser = await User.findById(userId);

        if (user.followers.includes(userId)) {
            user.followers = user.followers.filter((follower) => follower.toString() !== userId);
            currentUser.following = currentUser.following.filter((followed) => followed.toString() !== id);
            await user.save();
            await currentUser.save();
            res.json({ message: `You have unfollowed ${user.username}` });
        } else {
            res.status(400).json({ message: 'Not following this user' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error unfollowing user', error });
    }
};
