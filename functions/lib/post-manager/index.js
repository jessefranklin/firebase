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
exports.fetchPostsWithOffers = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.body.id;
    const profilePosts = yield admin
        .database()
        .ref(`profilePosts/${id}`)
        .once("value");
    var pp = profilePosts.val();
    const addOffers = yield Object.keys(pp).map((key, value) => {
        return admin
            .database()
            .ref(`offers/${key}`)
            .once("value", snap => {
            const ox = snap.val();
            return (pp[key].offers = [ox]);
        });
    });
    console.log(addOffers);
    Promise.all([profilePosts, addOffers])
        .then(() => {
        res.status(200).send(addOffers);
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
//# sourceMappingURL=index.js.map