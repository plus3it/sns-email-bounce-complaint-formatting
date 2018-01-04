'use strict';
console.log('Loading function');

var aws = require('aws-sdk');
var ses = new aws.SES({
  region: 'us-east-1'
});

exports.handler = (event, context, callback) => {
  //console.log('Received event:', JSON.stringify(event, null, 2));
  const message = JSON.parse(event.Records[0].Sns.Message);
  switch (message.notificationType) {
    case "Bounce":
      handleBounce(message);
      break;
    case "Complaint":
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
      ToAddresses: ["29447475+moskey71@users.noreply.github.com"]
    },
    Message: {
      Body: {
        Text: {
          Data: (item.UserId + " had an e-mail " + payload.notificationType + " from " + payload.mail.source + " at " + payload.mail.timestamp + ".  Please ask the tenant if the user's access should be removed.")
        }
      },
      Subject: {
        Data: "Email " + payload.notificationType + " in Testlab"
      }
    },
    Source: "29447475+moskey71@users.noreply.github.com"
  };
  console.log('===SENDING EMAIL===');
  const email = ses.sendEmail(eParams, function(err, data) {
    if (err) console.log(err);
    else {
      console.log("===EMAIL SENT===");
      console.log(data);


      console.log("EMAIL CODE END");
      console.log('EMAIL: ', email);
      context.succeed(event);

    }
  });
}
