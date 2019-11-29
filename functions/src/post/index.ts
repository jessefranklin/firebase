import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const postDraft = functions.https.onRequest(async (req, res) => {
  const post = req.body.obj;

  const promise1 = admin
    .database()
    .ref("posts/draft")
    .update({ [post.id]: post });

  await admin
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
});

export const postPublish = functions.https.onRequest(async (req, res) => {
  const post = req.body.obj;

  const newPost = {
    ...post,
    status: "published"
  };
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
});

export const postInProgress = functions.https.onRequest(async (req, res) => {
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
});

export const postClosed = functions.https.onRequest(async (req, res) => {
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
});

//Move post to closed listener
export const closePost = functions.database
  .ref("posts/inprogress/{postId}/ratings/")
  .onUpdate(async (change, context) => {
    const data = change.after;

    const postId = context.params.postId;
    // fetch post to determine  below then move to closed

    if (data.val().client != null && data.val().provider !== null) {
      const post = await admin
        .database()
        .ref(`posts/inprogress/${postId}`)
        .once("value");

      await admin
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
  });
