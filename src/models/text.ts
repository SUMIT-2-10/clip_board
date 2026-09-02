import mongoose, {Schema } from 'mongoose';

const textSchema = new Schema({
    content: { 
        type: String, 
        required: false,
        default: ""
    },

    link: {
        type: String,
        required: true,
        unique: true,   // 🔥 important
        index: true
    },

    expiresAt: { 
        type: Date, 
        default: () => Date.now() + 1000 * 60 * 60 * 24 // 24 hrs
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    fileUrl: {
        type: String,
        required: false
    },
    fileName: {
        type: String,
        required: false
    }

}, {
    timestamps: true // auto createdAt & updatedAt
});

if (mongoose.models.Text) {
    delete mongoose.models.Text;
}

const Text = mongoose.model('Text', textSchema);

export default Text;