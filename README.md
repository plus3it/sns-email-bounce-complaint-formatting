# sns-email-bounce-complaint-formatter

Terraform based lambda function that processes ses bounce and complaint messages

<!-- BEGIN TFDOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_aws"></a> [aws](#provider\_aws) | n/a |

## Resources

| Name | Type |
|------|------|
| [aws_iam_policy_document.lambda](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/data-sources/iam_policy_document) | data source |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_environment"></a> [environment](#input\_environment) | Descriptor for the email environment | `string` | n/a | yes |
| <a name="input_from_address"></a> [from\_address](#input\_from\_address) | Email address to expect bounce/complaint notifications to originate from | `string` | n/a | yes |
| <a name="input_project_name"></a> [project\_name](#input\_project\_name) | Name of the project | `string` | n/a | yes |
| <a name="input_sns_bounce_arn"></a> [sns\_bounce\_arn](#input\_sns\_bounce\_arn) | ARN of the SNS topic for email bounces | `string` | n/a | yes |
| <a name="input_sns_complaint_arn"></a> [sns\_complaint\_arn](#input\_sns\_complaint\_arn) | ARN of the SNS topic for email complaints | `string` | n/a | yes |
| <a name="input_to_address"></a> [to\_address](#input\_to\_address) | Email address to send bounce/complaint notifications to | `string` | n/a | yes |
| <a name="input_log_level"></a> [log\_level](#input\_log\_level) | Lambda log level | `string` | `"INFO"` | no |
| <a name="input_tags"></a> [tags](#input\_tags) | Map of tags to assign to the module resources | `map(any)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_lambda_arn"></a> [lambda\_arn](#output\_lambda\_arn) | n/a |

<!-- END TFDOCS -->
