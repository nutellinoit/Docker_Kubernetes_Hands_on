'use strict';

const config = require('./config');
const amqplib = require('amqplib/callback_api');
const nodemailer = require('nodemailer');
const simpleParser = require('mailparser-iconv-full').simpleParser;
var moment = require('moment');
var mailparsed;


// Setup Nodemailer transport
const transport = nodemailer.createTransport({
    host: config.relay.host,
    port: config.relay.port,
    secure: false,
    // we intentionally do not set any authentication
    // options here as we are going to use message specific
    // credentials
    tls: {
        rejectUnauthorized: false
    },
    // Security options to disallow using attachments from file or URL
    disableFileAccess: true,
    disableUrlAccess: true
}, {
    // Default options for the message. Used if specific values are not set
    from: 'sender@example.com'
});

// Create connection to AMQP server
amqplib.connect(config.amqp, (err, connection) => {
    if (err) {
        console.error(err.stack);
        return process.exit(1);
    }
    // Create channel
    connection.createChannel((err, channel) => {
        if (err) {
            console.error(err.stack);
            return process.exit(1);
        }

        // Ensure queue for messages
        channel.assertQueue(config.queue, {
            // Ensure that the queue is not deleted when server restarts
            durable: true
        }, err => {
            if (err) {
                console.error(err.stack);
                return process.exit(1);
            }

            // Only request 1 unacked message from queue
            // This value indicates how many messages we want to process in parallel


            channel.prefetch(1);


            // Set up callback to handle messages received from the queue
            channel.consume(config.queue, data => {
                if (data === null) {
                    return;
                }

                // Decode message contents
                let message = JSON.parse(data.content.toString());


                simpleParser(message.payload, (err, mail) => {

                    mailparsed = mail;
                    //console.log(" dentro parser: " + mailparsed);
                    console.log("============ DOPO PARSING ============");

                    //message=JSON.parse(mailparsed);
                    console.log("===================== MESSAGGIO ORIGINALE CODA ==============");
                    console.log(message);
                    console.log("===================== MESSAGGIO PARSATO ==============");
                    console.log(JSON.stringify(mailparsed));

                    mailparsed = JSON.stringify(mailparsed);
                    mailparsed = JSON.parse(mailparsed);
                    //console.log(JSON.stringify(mailparsed));
                    console.log("===================== FROM ==============");
                    console.log(mailparsed.from.value);

                    mailparsed.from = JSON.parse(JSON.stringify(mailparsed.from.value));

                    console.log("===================== TO ==============");

                    console.log(mailparsed.to.value);

                    mailparsed.to = JSON.parse(JSON.stringify(mailparsed.to.value));


                    console.log("===================== FROM2 ==============");

                    console.log(mailparsed.from);

                    console.log("===================== TO2 ==============");

                    console.log(mailparsed.to);

                    //ciclo i vari attachment
                    for (var i = 0; i < mailparsed.attachments.length; i++) {

                        var Bufferizzato = JSON.parse(JSON.stringify(mailparsed.attachments[i].content));
                        mailparsed.attachments[i].content = new Buffer(Bufferizzato.data);

                    }
                    /*
                     var Bufferizzato = JSON.parse(JSON.stringify(mailparsed.attachments[0].content));

                     mailparsed.attachments[0].content=new Buffer(Bufferizzato.data);
                     */


                    var DATE_RFC2822 = "ddd, DD MMM YYYY HH:mm:ss ZZ";
                    console.log(moment().format(DATE_RFC2822));

                    mailparsed.date = moment().format(DATE_RFC2822);


                    transport.sendMail(mailparsed, (err, info) => {
                        //tolgo lo stesso il messaggio dalla coda
                        //channel.ack(data);

                        if (err) {
                            console.log("===================== MESSAGGIO FALLITONE ==============");
                            console.log(mailparsed);
                            console.error(err.stack);
                            // put the failed message item back to queue
                            //return false;
                            return channel.nack(data);
                        }
                        console.log('Delivered message %s', info.messageId);

                        //prima di rimuovere l'item dalla coda, aspetto 3 secondi
                        console.log('Waiting %s milliseconds / Aspetto %s millisecondi', config.delaysend, config.delaysend);

                        wait(config.delaysend);

                        // remove message item from the queue
                        channel.ack(data);
                    });

                });


            });
        });
    });
});


function wait(ms) {
    var start = new Date().getTime();
    var end = start;
    while (end < start + ms) {
        end = new Date().getTime();
    }
}