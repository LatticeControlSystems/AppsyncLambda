const AWS = require('aws-sdk');
const axios = require('node_modules/axios/lib/axios.js');
var moment = require('moment');
exports.handler = async (event) => {

    AWS.config.update({
      region: 'us-west-2',
      credentials: new AWS.Credentials({
         accessKeyId: "***********",
         secretAccessKey: "*******************",
      })
    });
    const result = await invokeAppSync({ user1: 'dummy1', user2: 'dummy2' });

    console.log(result)
    // return result.data;
};
const invokeAppSync = async ({ user1, user2 }) => {
    let req = new AWS.HttpRequest('https://*********.appsync-api.us-west-2.amazonaws.com/graphql', '******');
    req.method = 'POST';
    req.headers.host = '**********.appsync-api.******.amazonaws.com';
    req.headers['Content-Type'] = 'application/json';
    req.body = JSON.stringify({
        "query":"mutation MutationCommentOnEvent($eventId: ID! $content: String! $createdAt: String!) {commentOnEvent(eventId: $eventId content: $content createdAt: $createdAt) {eventId commentId content createdAt}}",
            "variables": {
                    "eventId": "cb997499-d406-4d33-99e2-56e61de7f5cc",
                    "content": "8",
                    "createdAt": moment.utc().format(),
            }
    });
    let signer = new AWS.Signers.V4(req, 'appsync', true);
    signer.addAuthorization(AWS.config.credentials, AWS.util.date.getDate());
    console.log("here");
    const result = await axios({
        method: 'post',
        url: 'https://*************.appsync-api.us-west-2.amazonaws.com/graphql',
        data: req.body,
        headers: req.headers
    });
    return result;
};
