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
| environment | Descriptor for the email environment | `string` | `"test"` | no |
| from\_address | Email address to expect bounce/complaint notifications to originate from | `string` | `"noreply@example.com"` | no |
| log\_level | Lambda log level | `string` | `"INFO"` | no |
| project\_name | Name of the project | `string` | `"example-project"` | no |
| tags | Map of tags to assign to the module resources | `map` | `{}` | no |
| to\_address | Email address to send bounce/complaint notifications to | `string` | `"help@example.com"` | no |

## Outputs

| Name | Description |
|------|-------------|
| lambda\_arn | n/a |

<!-- END TFDOCS -->
