'use strict'

const fastify = require('fastify')();
const AWS = require('aws-sdk');
const cors = require("@fastify/cors")

require('dotenv').config();

AWS.config.update({
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const lambda = new AWS.Lambda();

fastify.register(cors);

fastify.get('/health', (request, reply) => {
    reply.send({
        message: 'Health Fastify',
    });
});

fastify.post('/test-sns', async (request, reply) => {
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
                timestamp: Date.now()
            }
        }).promise();

        reply.send({ success: true, message: 'Message published successfully and written to DynamoDB' });
    } catch (error) {
        console.error('Error processing message:', error);
        reply.status(500).send({ success: false, message: 'Failed to process message' });
    }
});

fastify.get('/test-sns', async (request, reply) => {
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

fastify.listen({ port: 3000 }, (err, address) => {
    if(err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at: ${address}`);
});