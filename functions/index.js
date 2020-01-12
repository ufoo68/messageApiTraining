'use strict';

const functions = require('firebase-functions');
const express = require('express');
const line = require('@line/bot-sdk');
const message = require('line-message-builder');

// channel secretとaccess tokenをFirebaseの環境変数から呼び出す
const config = {
    channelSecret: functions.config().channel.secret,
    channelAccessToken: functions.config().channel.accesstoken
};

const app = express();
//URL + /webhookで登録したWebhook URLが呼び出されたときに実行される。
app.post('/webhook', line.middleware(config), (req, res) => {
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);
//ユーザから受け取ったイベントについてのハンドリングを実装する
async function handleEvent(event) {
    //ユーザから送られた各メッセージに対する処理を実装する。
    //https://developers.line.biz/ja/reference/messaging-api/#message-event を参照。
    switch (event.message.type) {
        case 'text':
            return client.replyMessage(event.replyToken, message.buildReplyText('テキストを受け取りました。'));

        case 'image':
            return client.replyMessage(event.replyToken, message.buildReplyText('画像を受け取りました。'));

        case 'video':
            return client.replyMessage(event.replyToken, message.buildReplyText('動画を受け取りました。'));

        case 'audio':
            return client.replyMessage(event.replyToken, message.buildReplyText('音声を受け取りました。'));

        case 'file':
            return client.replyMessage(event.replyToken, message.buildReplyText('ファイルを受け取りました。'));

        case 'location':
            return client.replyMessage(event.replyToken, message.buildReplyText('位置情報を受け取りました。'));

        case 'sticker':
            return client.replyMessage(event.replyToken, message.buildReplyText('スタンプを受け取りました。'));
        default:
            return Promise.resolve(null);
    }
}

exports.app = functions.https.onRequest(app);