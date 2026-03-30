import mongoose, {Schema } from 'mongoose';

const textSchema = new Schema({
    content: { 
        type: String, 
        required: true 
    },

    link: {
        type: Number, // or String if you want links as strings
        required: true,
        unique: true,   // 🔥 important
        index: true
    },

    expiresAt: { 
        type: Date, 
        default: () => Date.now() + 1000 * 60 * 60 * 24 // 24 hrs
    },
    code: {
        type: Number,
        required: true,
        unique: true
    }

}, {
    timestamps: true // auto createdAt & updatedAt
});

const Text = mongoose.models.Text || mongoose.model('Text', textSchema);

export default Text;