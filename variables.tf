variable "environment" {
  type        = string
  description = "Descriptor for the email environment"
}

variable "from_address" {
  type        = string
  description = "Email address to expect bounce/complaint notifications to originate from"
}

variable "log_level" {
  type        = string
  default     = "INFO"
  description = "Lambda log level"
}

variable "project_name" {
  type        = string
  description = "Name of the project"
}

variable "sns_bounce_arn" {
  type        = string
  description = "ARN of the SNS topic for email bounces"
}

variable "sns_complaint_arn" {
  type        = string
  description = "ARN of the SNS topic for email complaints"
}

variable "tags" {
  type        = map
  default     = {}
  description = "Map of tags to assign to the module resources"
}

variable "to_address" {
  type        = string
  description = "Email address to send bounce/complaint notifications to"
}
