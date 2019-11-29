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
exports.rateClient = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    // POST RATING UNDER RATING <USER>
    // UPDATE USER PROFILE/
    const payload = req.body.payload;
    const fetchProfile = yield admin
        .database()
        .ref(`profiles/${payload.author}/`)
        .once("value");
    const fetchPost = yield admin
        .database()
        .ref(`posts/inprogress/${payload.post}/`)
        .once("value");
    console.log(fetchPost.val());
    const client = fetchPost.val().author;
    const provider = payload.author;
    const ratingObj = Object.assign({}, payload, { user: fetchProfile.val().name, photoUrl: fetchProfile.val().photoUrl });
    const promise1 = admin
        .database()
        .ref(`ratings/${client}/client/${payload.post}`)
        .set(ratingObj);
    const promise2 = admin
        .database()
        // .ref(`profiles/${provider}/offers/${payload.post}`)
        .ref(`profileOffers/${provider}/${payload.post}`)
        .update({
        status: "closed"
    });
    const promise3 = admin
        .database()
        .ref(`offers/${payload.post}/${provider}`)
        .update({
        status: "closed"
    });
    const promise4 = admin
        .database()
        .ref(`posts/inprogress/${payload.post}/ratings/`)
        .update({
        provider: "rated"
    });
    Promise.all([promise1, promise2, promise3, promise4])
        .then(() => {
        res.status(200).send("ok");
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
exports.rateProvider = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const payload = req.body.payload;
    const fetchProfile = yield admin
        .database()
        .ref(`profiles/${payload.author}/`)
        .once("value");
    const ratingObj = Object.assign({}, payload, { user: fetchProfile.val().name, photoUrl: fetchProfile.val().photoUrl });
    const promise1 = admin
        .database()
        .ref(`ratings/${payload.rate}/provider/${payload.post}`)
        .update(ratingObj);
    const promise2 = admin
        .database()
        .ref(`posts/inprogress/${payload.post}/ratings/`)
        .update({
        client: "rated"
    });
    const promise3 = admin
        .database()
        // .ref(`profiles/${payload.author}/posts/${payload.post}`)
        .ref(`profilePosts/${payload.author}/${payload.post}`)
        .update({
        status: "closed"
    });
    Promise.all([promise1, promise2, promise3])
        .then(() => {
        res.status(200).send("ok");
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
exports.ratingAvg = functions.database
    .ref("ratings/{userId}/{path}/{transactionId}")
    .onCreate((snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    const data = snapshot.val(); // if this is your rating obj
    const userId = context.params.userId; // this is your user
    const path = context.params.path; // this could be the uid for the record
    const profileAvg = yield admin
        .database()
        .ref(`profiles/${userId}/${path}`)
        .once("value");
    const newAvg = profileAvg.val().avgRating
        ? ((profileAvg.val().avgRating + data.rating) / 2).toFixed(2)
        : data.rating;
    return admin
        .database()
        .ref(`profiles/${userId}/${path}`)
        .update({
        avgRating: newAvg
    })
        .then(res => {
        console.log(res);
    })
        .catch(err => {
        console.log(err);
    });
}));
//# sourceMappingURL=index.js.map