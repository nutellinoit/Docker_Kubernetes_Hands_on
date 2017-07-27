'use strict';

const amqplib = require('amqplib/callback_api');
const config = require('./config');
const authuser = require('./auth');
const SMTPServer = require('smtp-server').SMTPServer;
var messaggio = "";
var bufferConcat = require('buffer-concat');
var Iconv = require('iconv').Iconv;
var charset_extract = "";
//devo creare anche qui il server SMTP come server.js

const server = new SMTPServer({

    // log to console
    logger: false,

    // not required but nice-to-have
    banner: 'Benvenuto nel magico mondo dell smtp da fuori',

    // disable STARTTLS to allow authentication in clear text mode
    disabledCommands: ['STARTTLS'],

    // Accept messages up to config.publisher.messagesize MB. This is a soft limit
    size: config.publisher.messagesize * 1024 * 1024,


    // Account cheching on auth.json


    onAuth(auth, session, callback){

        for (var i = 0; i < authuser.users.length; i++) {


            if (authuser.users[i].username == auth.username && authuser.users[i].password == auth.password) {
                return callback(null, {
                    user: {
                        username: auth.username
                    }
                });
            }


        }
        return callback(new Error('Invalid username or password'));


    },


    // Handle message stream
    onData(stream, session, callback) {
        console.log('Streaming message from user %s', session.user.username);
        console.log('------------------');
        //stream.pipe(process.stdout);


        var chunks = [];
        stream.on('data', (chunk) => {
            //chunks.push(chunk.toString());
            chunks.push(chunk);
            //console.log(chunk);

        });


        stream.on('end', () => {


            console.log(''); // ensure linebreak after the message
            //console.log("======== PRIMA DI STAMPA PULIZIA ======");
            var pulizia = bufferConcat(chunks).toString();

            pulizia = pulizia.replace(/ /g, '');

            pulizia = pulizia.replace(/"/g, '');

            console.log(pulizia);
            //console.log("======== PRIMA DI STAMPA DEL CHUNKOTTO TOTALO ======");
            var splittata = pulizia.split("charset=");

            //console.log(bufferConcat(chunks).toString());

            //console.log("======== PRIMA DI STAMPA SPLITTATA ======");
            //console.log(splittata);
            //console.log("======== DOPO STAMPA SPLITTATA ======");
            if (splittata[1] != '') {
                var splittata2 = splittata[1].split(";");
                //console.log("CHARSETSAM %s",splittata2[0]);
                charset_extract = splittata2[0].split("\n");
                charset_extract = charset_extract[0];
                //console.log("CHARSETEXTRACT %s",charset_extract);
            }

            console.log("THE LAST LOG: %s", charset_extract.toUpperCase().trim());

            var iconv = new Iconv(charset_extract.toUpperCase().trim(), 'UTF-8//TRANSLIT');

            console.log(''); // ensure linebreak after the message


            var str = iconv.convert(Buffer.concat(chunks)).toString();
            console.log("======== PRIMA DI STAMPA MESSAGGIO CONVERTITO CON ICONV ======");
            console.log(str);
            console.log("======== DOPO STAMPA MESSAGGIO CONVERTITO ======");
            messaggio = str;

            // Create connection to AMQP server

            //inizio infilamento in coda del messaggio
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

                        // Create a function to send objects to the queue
                        // Javascript opbject is converted to JSON and the into a Buffer
                        let sender = (content, next) => {
                            let sent = channel.sendToQueue(config.queue, Buffer.from(JSON.stringify(content)), {
                                // Store queued elements on disk
                                persistent: true,
                                contentType: 'application/json'
                            });
                            if (sent) {
                                return next();
                            } else {
                                channel.once('drain', () => next());
                            }
                        };

                        // push 100 messages to queue
                        let sent = 0;
                        let sendNext = () => {
                            if (sent >= 1) {
                                console.log('All messages sent!');
                                // Close connection to AMQP server
                                // We need to call channel.close first, otherwise pending
                                // messages are not written to the queue
                                return channel.close(() => connection.close());
                            }
                            sent++;


                            sender({
                                payload: messaggio,
                            }, sendNext);
                        };

                        sendNext();

                    });
                });
            });

            //fine infilamento in coda del messaggio


            callback(null, 'Message queued as ' + Date.now()); // accept the message once the stream is ended
        });
    }
});

server.on('error', err => {
    console.log('Error occurred');
    console.log(err);
});

// start listening
server.listen(config.publisher.port, config.publisher.host);






