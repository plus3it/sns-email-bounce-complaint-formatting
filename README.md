# sns-email-bounce-complaint-formatter

Terraform based lambda function that processes ses bounce and complaint messages

<!-- BEGIN TFDOCS -->
## Requirements

No requirements.

## Providers

| Name | Version |
|------|---------|
| aws | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| environment | Descriptor for the email environment | `string` | n/a | yes |
| from\_address | Email address to expect bounce/complaint notifications to originate from | `string` | n/a | yes |
| project\_name | Name of the project | `string` | n/a | yes |
| sns\_bounce\_arn | ARN of the SNS topic for email bounces | `string` | n/a | yes |
| sns\_complaint\_arn | ARN of the SNS topic for email complaints | `string` | n/a | yes |
| to\_address | Email address to send bounce/complaint notifications to | `string` | n/a | yes |
| log\_level | Lambda log level | `string` | `"INFO"` | no |
| tags | Map of tags to assign to the module resources | `map(any)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| lambda\_arn | n/a |

<!-- END TFDOCS -->
