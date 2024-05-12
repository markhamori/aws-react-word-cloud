'use strict'

const fastify = require('fastify')();
const AWS = require('aws-sdk');

require('dotenv').config();

// Set up AWS credentials
AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create an instance of the SNS service
const sns = new AWS.SNS();

fastify.register(require('fastify-websocket'));

fastify.get('/hello', (request, reply) => {
    reply.send({
        message: 'Hello Fastify'
    });
});

fastify.get('/hello-ws', { websocket: true }, (connection /* WebSocket */, req /* FastifyRequest */) => {
    connection.socket.on('message', message => {
      message.toString() === 'hi from client'
      console.log('Received message:', message);
      connection.socket.send('Message received: ' + message);
    });
})

fastify.setNotFoundHandler((request, reply) => {
    reply.code(404).send({ error: 'Not Found', message: 'Route not found' });
});

fastify.listen({ port: 3000 }, (err, address) => {
    if(err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at: ${address}`);
});

// Define WebSocket connection handler
// fastify.register(websocketPlugin, { handle });
function handle (connection) {
    connection.socket.on('message', message => {
      connection.socket.send(message); // Echo back the received message
      publishToAWS(message); // Publish message to AWS SNS
    });
  }
  
  // Function to publish message to AWS SNS
  function publishToAWS(message) {
      const params = {
          Message: message,
          TopicArn: 'arn:aws:sns:your-region:your-account-id:your-topic-name'
      };
  
      sns.publish(params, (err, data) => {
          if (err) {
              console.error('Error publishing message:', err);
          } else {
              console.log('Message published successfully:', data);
          }
      });
  }