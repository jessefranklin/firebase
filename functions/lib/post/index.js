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
exports.postDraft = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const post = req.body.obj;
    const promise1 = admin
        .database()
        .ref("posts/draft")
        .update({ [post.id]: post });
    yield admin
        .database()
        .ref("posts/published")
        .child(post.id)
        .remove();
    const profilePost = {
        id: post.id,
        title: post.meta.title,
        status: "draft"
    };
    const promise2 = admin
        .database()
        // .ref("profiles/" + post.author + "/posts/" + post.id)
        .ref(`profilePosts/${post.author}/${post.id}`)
        .set(profilePost);
    Promise.all([promise1, promise2])
        .then(() => {
        res.status(200).send(profilePost);
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
exports.postPublish = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const post = req.body.obj;
    const newPost = Object.assign({}, post, { status: "published" });
    const promise1 = admin
        .database()
        .ref("posts/published")
        .update({ [post.id]: newPost });
    const promise2 = admin
        .database()
        .ref("posts/draft")
        .set({ [post.id]: null });
    const profilePost = {
        id: post.id,
        title: post.meta.title,
        status: "published"
    };
    const promise3 = admin
        .database()
        // .ref("profiles/" + post.author + "/posts/" + post.id)
        .ref(`profilePosts/${post.author}/${post.id}`)
        .update({ status: "published" });
    Promise.all([promise1, promise2, promise3])
        .then(() => {
        res.status(200).send(profilePost);
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
exports.postInProgress = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const post = req.body.obj;
    const promise1 = admin
        .database()
        .ref("posts/inprogress")
        .update({ [post.id]: post });
    const promise2 = admin
        .database()
        .ref("posts/published")
        .set({ [post.id]: null });
    const profilePost = {
        id: post.id,
        title: post.meta.title,
        status: "inprogress"
    };
    const promise3 = admin
        .database()
        // .ref("profiles/" + post.author + "/posts/" + post.id)
        .ref(`profilePosts/${post.author}/${post.id}`)
        .update({ status: "inprogress" });
    Promise.all([promise1, promise2, promise3])
        .then(() => {
        res.status(200).send(profilePost);
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
exports.postClosed = functions.https.onRequest((req, res) => __awaiter(this, void 0, void 0, function* () {
    const post = req.body.obj;
    const promise1 = admin
        .database()
        .ref("posts/closed")
        .update({ [post.id]: post });
    const promise2 = admin
        .database()
        .ref("posts/inprogress")
        .set({ [post.id]: null });
    const profilePost = {
        id: post.id,
        title: post.meta.title,
        status: "closed"
    };
    const promise3 = admin
        .database()
        // .ref("profiles/" + post.author + "/posts/" + post.id)
        .ref(`profilePosts/${post.author}/${post.id}`)
        .update({ status: "closed" });
    Promise.all([promise1, promise2, promise3])
        .then(() => {
        res.status(200).send(profilePost);
    })
        .catch(err => {
        console.log(err.stack);
        res.status(500).send("error");
    });
}));
//Move post to closed listener
exports.closePost = functions.database
    .ref("posts/inprogress/{postId}/ratings/")
    .onUpdate((change, context) => __awaiter(this, void 0, void 0, function* () {
    const data = change.after;
    const postId = context.params.postId;
    // fetch post to determine  below then move to closed
    if (data.val().client != null && data.val().provider !== null) {
        const post = yield admin
            .database()
            .ref(`posts/inprogress/${postId}`)
            .once("value");
        yield admin
            .database()
            .ref(`posts/closed/`)
            .set({ postId: post.val() });
        return admin
            .database()
            .ref(`posts/inprogress/${postId}`)
            .set(null)
            .then(res => {
            console.log(res);
        })
            .catch(err => {
            console.log(err);
        });
    }
    return;
}));
//# sourceMappingURL=index.js.map