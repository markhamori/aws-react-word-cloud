const awsLambdaFastify = require('@fastify/aws-lambda');
const fastify = require('./app');

const proxy = awsLambdaFastify(fastify);

exports.handler = (event, context) => {
    return proxy(event, context);
};