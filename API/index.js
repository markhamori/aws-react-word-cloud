const awsLambdaFastify = require('@fastify/aws-lambda');
const fastify = require('./app');

const proxy = awsLambdaFastify(fastify);

exports.handler = async (event, context) => {
    console.log(proxy)
    return proxy(event, context);
};