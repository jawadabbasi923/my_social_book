import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 3,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
        },
        profilePicture: {
            type: String,
        },
        bio: {
            type: String,
            maxlength: 160,
        },
        followers: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],
        following: [
            { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        ],
        dateOfBirth: {
            type: Date,
        },
        location: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        settings: {
            privacy: {
                profileVisibility: {
                    type: String,
                    enum: ['public', 'friends', 'private'],
                    default: 'public',
                },
                messaging: {
                    type: String,
                    enum: ['everyone', 'friends', 'none'],
                    default: 'everyone',
                },
            },
            notifications: {
                likes: { type: Boolean, default: true },
                comments: { type: Boolean, default: true },
                follows: { type: Boolean, default: true },
                messages: { type: Boolean, default: true },
            },
        },
    },
    { timestamps: true }
);

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);
export default User;
