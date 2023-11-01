#!/usr/bin/env node

var express = require("express");
var router = express.Router();

var amqp = require("amqplib/callback_api");

const url = "amqp://default-producer-user:159357@localhost:5672";
const defaultqueues = [
  "default-test-queue",
  "default-test-transient-queue",
  "default-test-autodel-queue",
];

amqp.connect(url, function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }
    defaultqueues.forEach((element) => {
      var random = Math.random();
      var queue = element;
      var msg = `Hello ${element.toString()} from ${random} code.`;

      channel.assertQueue(queue, {
        durable: element != "default-test-transient-queue" ? true : false,
        autoDelete: element != "default-test-autodel-queue" ? false : true,
      });

      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [+] Sent %s", msg);
    });
    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
