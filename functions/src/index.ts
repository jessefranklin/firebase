import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

import * as Offers from "./offers";
import * as Ratings from "./ratings";
import * as Accounts from "./accounts";
import * as Fetch from "./fetch";
import * as Post from "./post";
import * as PostManager from "./post-manager";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

admin.initializeApp(functions.config().firebase);

export const makeOffer = Offers.makeOffer;
export const approveOffer = Offers.approveOffer;
export const clientOfferCompletedApproval = Offers.clientOfferCompletedApproval;
export const providerOfferCompleted = Offers.providerOfferCompleted;
export const closeOffer = Offers.closeOffer;

export const rateClient = Ratings.rateClient;
export const rateProvider = Ratings.rateProvider;
export const ratingAvg = Ratings.ratingAvg;

export const fetchPosts = Fetch.fetchPosts;

export const postDraft = Post.postDraft;
export const postPublish = Post.postPublish;
export const postClosed = Post.postClosed;
export const postInProgress = Post.postInProgress;
export const closePost = Post.closePost;

export const fetchPostsWithOffers = PostManager.fetchPostsWithOffers;

export const accountBalance = Accounts.accountBalance;
