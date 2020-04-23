"""
Lambda function used to process SES bounce and Complaint messages
"""

import boto3
import collections
import json
import logging
import os

DEFAULT_LOG_LEVEL = logging.DEBUG
LOG_LEVELS = collections.defaultdict(
    lambda: DEFAULT_LOG_LEVEL,
    {
        "critical": logging.CRITICAL,
        "error": logging.ERROR,
        "warning": logging.WARNING,
        "info": logging.INFO,
        "debug": logging.DEBUG,
    },
)

# Lambda initializes a root logger that needs to be removed in order to set a
# different logging config
root = logging.getLogger()
if root.handlers:
    for handler in root.handlers:
        root.removeHandler(handler)

log_file_name = ""
if not os.environ.get("AWS_EXECUTION_ENV"):
    log_file_name = "ses-handler.log"

logging.basicConfig(
    filename=log_file_name,
    format="%(asctime)s.%(msecs)03dZ [%(name)s][%(levelname)-5s]: %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    level=LOG_LEVELS[os.environ.get("LOG_LEVEL", "").lower()],
)
log = logging.getLogger(__name__)

ses = boto3.client("ses")
TO_ADDRESS = os.environ.get("TO_ADDRESS")
FROM_ADDRESS = os.environ.get("FROM_ADDRESS")
ENV_NAME = os.environ.get("ENV_NAME")


def send_email(id, payload, status):
    log.debug("Sending message")

    email_body = (
        f'{id} had an email {payload["notificationType"]}'
        f' from {payload["mail"]["source"]} at {payload["mail"]["timestamp"]}.'
        f" \n"
        f" Please ask the tenant if the user's access should be removed."
        f" \n\n\n"
        f' {payload["notificationType"]}'
        f' E-mail subject {payload["mail"]["commonHeaders"]["subject"]}'
        f" \n\n\n"
        f' {payload["notificationType"]}'
        f' reason: {payload["bounce"]["bouncedRecipients"][0]["diagnosticCode"]}'
    )
    email_subject = f'{id} Email {payload["notificationType"]} in {ENV_NAME}'

    email_object = {
        "Destination": {"ToAddresses": [TO_ADDRESS]},
        "Message": {
            "Body": {"Text": {"Charset": "UTF-8", "Data": email_body},},
            "Subject": {"Charset": "UTF-8", "Data": email_subject},
        },
        "Source": FROM_ADDRESS,
    }
    ses.send_email(**email_object)


def handle_bounce(
    message, notify_bounce_types=None, notify_bounce_subtypes=None, **kwargs
):
    log.debug("Processing bounce message")

    notify_bounce_types = notify_bounce_types or []
    notify_bounce_subtypes = notify_bounce_subtypes or []

    addresses = []
    for address in message["bounce"]["bouncedRecipients"]:
        addresses.append(address["emailAddress"])

    bounce_type = message["bounce"]["bounceType"]
    bounce_subtype = message["bounce"]["bounceSubType"]
    log.debug(
        "Message: %s bounced when sending to %s. Bounce type: %s subtype: %s",
        message["mail"]["messageId"],
        addresses,
        bounce_type,
        bounce_subtype,
    )

    if bounce_type in notify_bounce_types and bounce_subtype in notify_bounce_subtypes:
        for email_address in addresses:
            send_email(email_address, message, "disable")


def handle_complaint(message, **kwargs):
    log.debug("Processing complaint message")

    addresses = []
    for address in message["bounce"]["bouncedRecipients"]:
        addresses.append(address["emailAddress"])

    log.debug(
        "Message: A compliant was reported by %s for message %s.",
        json.dumps(addresses),
        message["mail"]["messageId"],
    )

    for email_address in addresses:
        send_email(email_address, message, "disable")


def handler(event, context):
    log.debug("received event: %s", event)

    message = json.loads(event["Records"][0]["Sns"]["Message"])
    strategy = {"Complaint": handle_complaint, "Bounce": handle_bounce}

    config = {
        "notify_bounce_subtypes": ["General", "NoEmail", "Undetermined"],
        "notify_bounce_types": ["Permanent", "Undetermined"],
    }
    try:
        return strategy[message["notificationType"]](message, **config)
    except KeyError as e:
        log.error("Encountered unknown message type: %s", e)
        raise
