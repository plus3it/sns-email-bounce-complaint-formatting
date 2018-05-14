'use strict';
console.log('Loading function');

var aws = require('aws-sdk');
var ses = new aws.SES({
  region: 'us-east-1'
});
/*global callback*/
var toaddress = process.env.toaddress;
var fromaddress = process.env.fromaddress;
var envname = process.env.envname;

module.exports.handler = (event, context, callback) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));
  const message = JSON.parse(event.Records[0].Sns.Message);
  switch (message.notificationType) {
    case 'Bounce':
      handleBounce(message);
      break;
    case 'Complaint':
      handleComplaint(message);
      break;
    default:
      callback("Unknown notification type: " + message.notificationType);
  }
};

function handleBounce(message) {
  const messageId = message.mail.messageId;
  const addresses = message.bounce.bouncedRecipients.map(function(recipient) {
    return recipient.emailAddress;
  });
  const bounceType = message.bounce.bounceType;

  console.log("Message " + messageId + " bounced when sending to " + addresses.join(", ") + ". Bounce type: " + bounceType);

  for (var i = 0; i < addresses.length; i++) {
    email(addresses[i], message, "disable");
  }
}

function handleComplaint(message) {
  const messageId = message.mail.messageId;
  const addresses = message.complaint.complainedRecipients.map(function(recipient) {
    return recipient.emailAddress;
  });

  console.log("A complaint was reported by " + addresses.join(", ") + " for message " + messageId + ".");

  for (var i = 0; i < addresses.length; i++) {
    email(addresses[i], message, "disable");
  }
}

function email(id, payload, status) {
  const item = {
    UserId: id,
    notificationType: payload.notificationType,
    from: payload.mail.source,
    timestamp: payload.mail.timestamp
  };
  const eParams = {
    Destination: {
      ToAddresses: [toaddress]
    },
    Message: {
      Body: {
        Text: {
          Data: (item.UserId + " had an e-mail " + payload.notificationType + " from " + payload.mail.source + " at " + payload.mail.timestamp + ".  Please ask the tenant if the user's access should be removed." + "\n \n \n Bounce reason:" + payload.bounce.bouncedRecipients[0].diagnosticCode )
        }
      },
      Subject: {
        Data: "Email " + payload.notificationType + " in " + envname
      }
    },
    Source: fromaddress
  };
  console.log('===SENDING EMAIL===');
  ses.sendEmail(eParams, function(err, data) {
    if (err) callback(err); // an error occurred
    else console.log(data); // successful response
  });
}
