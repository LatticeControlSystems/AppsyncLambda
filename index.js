const AWS = require('aws-sdk');
const axios = require('node_modules/axios/lib/axios.js');
var moment = require('moment');
exports.handler = function(event, context, callback) {

    AWS.config.update({
      region: '<region>',
      credentials: new AWS.Credentials({
         accessKeyId: "<accessKeyId>",
         secretAccessKey: "<secretAccessKey>",
      })
    });
    const result =  invokeAppSync({ eventId: event.eventId, content: event.content });

    console.log(result)
    // return result.data;
};
const invokeAppSync = async ({ eventId, content }) => {
    let req = new AWS.HttpRequest('https://************.appsync-api.<region>.amazonaws.com/graphql', '<region>');
    req.method = 'POST';
    req.headers.host = '************.appsync-api.<region>.amazonaws.com';
    req.headers['Content-Type'] = 'application/json';
    req.body = JSON.stringify({
        "query":"mutation MutationCommentOnEvent($eventId: ID! $content: String! $createdAt: String!) {commentOnEvent(eventId: $eventId content: $content createdAt: $createdAt) {eventId commentId content createdAt}}",
            "variables": {
                    "eventId": eventId,
                    "content": content,
                    "createdAt": moment.utc().format(),
            }
    });
    let signer = new AWS.Signers.V4(req, 'appsync', true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    const result = await axios({
        method: 'post',
        url: 'https://************..appsync-api.<region>.amazonaws.com/graphql',
        data: req.body,
        headers: req.headers
    });
    return result;
};
