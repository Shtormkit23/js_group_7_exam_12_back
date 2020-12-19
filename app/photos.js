const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const {nanoid} = require("nanoid");
const config = require("../config");
const auth = require("../middleware/auth");
const Photo = require("../models/Photo");
const User = require("../models/User");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({storage});

router.get('/', async (req, res) => {
    try {
        const photos = await Photo.find().populate("user");
        res.send(photos);
    } catch {
        res.sendStatus(500);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const photos = await Photo.find({user: userId}).populate("user");
        res.send(photos);
    } catch {
        res.sendStatus(500);
    }
});

router.post("/", auth, upload.single("image"), async (req, res) => {
    const photoData = req.body;

    const token = req.get('Authorization');
    const userToken = await User.findOne({token});

    photoData.user = userToken._id;
    if (req.file) {
        photoData.image = req.file.filename;
    }

    const photo = new Photo(photoData);
    try {
        await photo.save();
        res.send(photo);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const token = req.get('Authorization');
        const user = await User.findOne({token});
        const userId = user._id;
        const response = await Photo.findOneAndRemove({
            _id: req.params.id,
            user: userId
        });
        if (!response) {
            return res.sendStatus(402);
        }
        return res.send({
            message: `${req.params.id} removed`,
        });
    } catch (e) {
        return res.status(422).send(e.message);
    }
});

module.exports = router;