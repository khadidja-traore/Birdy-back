const express = require("express");
const Friends = require("./entities/friends.js");

function init(db) {
    const router = express.Router();
    // On utilise JSON
    router.use(express.json());
    // simple logger for this router's requests
    // all requests to this router will first hit this middleware
    router.use((req, res, next) => {
        console.log('API: method %s, path %s', req.method, req.path);
        console.log('Body', req.body);
        next();
    });

    const friends = new Friends.default(db);

    // add new friendship
    router.put("/friends", (req, res) => {
        const { firstUser, secondUser } = req.body;
        if (!firstUser || !secondUser) {
            console.log(firstUser);
            console.log(secondUser);
            res.status(400).send("At least one of the friend is missing!");
        } else {
            friends.add(firstUser, secondUser)
                .then((friends_id) => res.status(201).send({ id: friends_id }))
                .catch((err) => res.status(500).send(err));
        }
    });

    // get one specific friendship
    router.route("/friends/:friend_id(\\d+)").get(async (req, res) => {
        try {
            const friend = await friends.get(req.params.friend_id);
            console.log(friend);
            if (!friend)
                res.status(404).json({
                    status: 404,
                    message: "ami non trouvé"
                });
            else
                res.send(friend);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })
        // delete one specific freindship
        .delete(async (req, res, next) => {
            try {
                const friend = await friends.get(req.params.friend_id);
                console.log(friend);
                if (!friend) {
                    res.status(404).json({
                        status: 404,
                        message: "ami non trouvé"
                    });
                    return;
                }
                friends.delete(req.params.friend_id)
                    .then((friend_id) => res.status(201).json({ status: "200", message: "Ami supprimé" }))
                    .catch((err) => res.status(500).send(err));
            } catch (e) {
                res.status(500).json({
                    status: 500,
                    message: "erreur interne",
                    details: (e || "Erreur inconnue").toString()
                });
            }
        })

    // get the entire list of friends
    router.route("/friends").get(async (req, res) => {
        try {
            const friendsList = await friends.getList();
            console.log("The list of friends:")
            console.log(friendsList);
            if (!friendsList)
                res.sendStatus(404);
            else
                res.send(friendsList);
        }
        catch (e) {
            res.status(500).send(e);
        }
    })

    return router;
}
exports.default = init;

