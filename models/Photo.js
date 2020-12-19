const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PhotoSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: [true, "Поле title обязательно для заполнения"]
    },
    image: {
        type: String,
        required: [true, "Поле image обязательно для заполнения"]
    }
});

const Photo = mongoose.model("Photo", PhotoSchema);
module.exports = Photo;