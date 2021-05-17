data "aws_iam_policy_document" "lambda" {

  statement {
    sid = "AllowSESSend"
    actions = [
      "ses:SendEmail",
      "ses:SendRawEmail",
    ]
    resources = ["*"]
  }
}

module "lambda" {
  source = "git::https://github.com/plus3it/terraform-aws-lambda.git?ref=v1.3.0"

  function_name = "${var.project_name}-bounce-complaint-handler"
  description   = "Processes ses bounce and complaint messages"
  handler       = "lambda.handler"
  runtime       = "python3.7"
  timeout       = 300

  source_path = "${path.module}/lambda"
  policy      = data.aws_iam_policy_document.lambda

  environment = {
    variables = {
      FROM_ADDRESS = var.from_address
      TO_ADDRESS   = var.to_address
      ENV_NAME     = var.environment
      LOG_LEVEL    = var.log_level
    }
  }

  tags = var.tags
}

resource "aws_sns_topic_subscription" "bounce" {
  endpoint  = module.lambda.function_arn
  protocol  = "lambda"
  topic_arn = var.sns_bounce_arn
}

resource "aws_sns_topic_subscription" "complaint" {
  endpoint  = module.lambda.function_arn
  protocol  = "lambda"
  topic_arn = var.sns_complaint_arn
}

resource "aws_lambda_permission" "bounce" {
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.sns_bounce_arn
}

resource "aws_lambda_permission" "complaint" {
  action        = "lambda:InvokeFunction"
  function_name = module.lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = var.sns_complaint_arn
}
