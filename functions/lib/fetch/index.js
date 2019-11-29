"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
exports.fetchPosts = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const geocode = req.body.geocode;
    const promise1 = yield admin
        .database()
        .ref("posts/published")
        .orderByChild("geocode")
        .equalTo(geocode)
        .once("value");
    Promise.all([promise1])
        .then(() => {
        res.status(200).send(promise1);
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
exports.fetchPostsWithOffers = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const geocode = req.body.geocode;
    const promise1 = yield admin
        .database()
        .ref("posts")
        .orderByChild("geocode")
        .equalTo(geocode)
        .once("value");
    Promise.all([promise1])
        .then(() => {
        res.status(200).send(promise1);
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
exports.profileWithOffers = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const offer = req.body.offer;
    const promise1 = admin
        .database()
        .ref(`posts/${offer.id}`)
        .update({
        status: "rateProvider"
    });
    Promise.all([promise1])
        .then(() => {
        res.status(200).send("ok");
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
exports.profileWithPosts = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const offer = req.body.offer;
    const promise1 = admin
        .database()
        .ref(`posts/${offer.id}`)
        .update({
        status: "rateProvider"
    });
    Promise.all([promise1])
        .then(() => {
        res.status(200).send("ok");
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
exports.postsWithOffers = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const offer = req.body.offer;
    const promise1 = admin
        .database()
        .ref(`posts/${offer.id}`)
        .update({
        status: "rateProvider"
    });
    Promise.all([promise1])
        .then(() => {
        res.status(200).send("ok");
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
//# sourceMappingURL=index.js.map