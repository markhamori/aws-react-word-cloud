'use strict'

const fastify = require('fastify')({ logger: true });
const AWS = require('aws-sdk');
const cors = require("@fastify/cors")

require('dotenv').config();

const PORT = process.env.PORT || 3000

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

fastify.register(cors, {
    origin: 'https://dev.d1n1k1ll12aekj.amplifyapp.com',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    credentials: true
});

fastify.get('/health', (request, reply) => {
    reply.send({
        message: 'Health Fastify',
    });
});

fastify.post('/words', async (request, reply) => {
    const { message } = request.body;

    try {
        const snsResponse = await sns.publish({
            Message: message,
            TopicArn: process.env.AWS_SNS_WORD_CLOUD_TOPIC_ARN
        }).promise();

        await dynamoDB.put({
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
            Item: {
                messageId: snsResponse.MessageId,
                messageText: message,
                timestamp: Date.now(),
            }
        }).promise();

        reply.send({ success: true, message: 'Message published successfully and written to DynamoDB' });
    } catch (error) {
        console.error('Error processing message:', error);
        reply.status(500).send({ success: false, message: 'Failed to process message' });
    }
});

fastify.get('/words', async (request, reply) => {
    try {
        const dynamoDBResponse = await dynamoDB.scan({
            TableName: process.env.AWS_DYNAMODB_TABLE_NAME
        }).promise();

        const messages = dynamoDBResponse.Items.map(item => ({
            messageId: item.messageId,
            messageText: item.messageText,
            timestamp: item.timestamp
        }));

        reply.send({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        reply.status(500).send({ success: false, message: 'Failed to fetch messages' });
    }
});

fastify.listen({ port: PORT }, (err, address) => {
    if(err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at: ${address}`);
});

fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
});

module.exports = fastify;