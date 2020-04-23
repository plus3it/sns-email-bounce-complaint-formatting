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
  source = "github.com/claranet/terraform-aws-lambda"

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
