#!/usr/bin/env node

var express = require("express");
var router = express.Router();

var amqp = require("amqplib/callback_api");

const url = "amqp://default-consumer-user:159357@localhost:5672";
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
      var queue = element;

      channel.assertQueue(queue, {
        durable: queue != "default-test-transient-queue" ? true : false,
        autoDelete: queue != "default-test-autodel-queue" ? false : true,
      });

      console.log(
        " [...] Waiting for messages in %s. To exit press CTRL+C",
        queue
      );

      channel.consume(
        queue,
        function (msg) {
          console.log(" [-] Received %s", msg.content.toString());
        },
        {
          noAck: true,
        }
      );
    });
    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
});
