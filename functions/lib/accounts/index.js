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
exports.accountBalance = functions.database
    .ref("accounts/{userId}/transactions/{transId}")
    .onCreate((snapshot, context) => __awaiter(this, void 0, void 0, function* () {
    const data = snapshot;
    const userId = context.params.userId;
    const account = yield admin
        .database()
        .ref(`accounts/${userId}/`)
        .once("value");
    console.log("new account total");
    const newTotal = account.val().balance
        ? account.val().balance + data.val().total
        : data.val().total;
    console.log(newTotal);
    yield admin
        .database()
        .ref(`profiles/${userId}/account`)
        .update({
        balance: newTotal
    });
    return admin
        .database()
        .ref(`accounts/${userId}/`)
        .update({
        balance: newTotal
    })
        .then(res => {
        console.log(res);
    })
        .catch(err => {
        console.log(err);
    });
}));
//# sourceMappingURL=index.js.map