const mongoose = require("mongoose");
const {nanoid} = require("nanoid");
const config = require("./config");
const Photo = require('./models/Photo');
const User = require('./models/User');

mongoose.connect(config.db.url + "/" + config.db.name, {useNewUrlParser: true});

const db = mongoose.connection;

db.once("open", async () => {
    try {
        await db.dropCollection("photos");
        await db.dropCollection("users");
    } catch (e) {
        console.log('Collections were not present, skipping drop...');
    }

    const [user, admin] = await User.create({
        username: "user",
        email: "user@shop.com",
        password: "12345678Kk",
        token: nanoid(),
        role: "user",
        avatarImage: "img-1.jpg",
        displayName: "FireFox"
    }, {
        username: "admin",
        email: "admin@shop.com",
        password: "12345678Kk",
        token: nanoid(),
        role: "admin",
        avatarImage: "img-1.jpg",
        displayName: "FoxTerrier"
    });

    await Photo.create({
            user: user._id,
            title: "Mysterious space",
            image: "img-2.jpg"
        }, {
            user: user._id,
            title: "Mysterious space",
            image: "img-1.jpg"
        }, {
            user: admin._id,
            title: "Mysterious space",
            image: "img-3.jpg"
        }, {
            user: admin._id,
            title: "Mysterious space",
            image: "img-5.jpg"
        }
        , {
            user: user._id,
            title: "Mysterious space",
            image: "img-6.jpg"
        }, {
            user: admin._id,
            title: "Mysterious space",
            image: "img-4.jpg"
        }
    );

    db.close();
});

