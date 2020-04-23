variable "project_name" {
  type        = string
  default     = "example-project"
  description = "Name of the project"
}

variable "from_address" {
  type        = string
  default     = "noreply@example.com"
  description = "Email address to expect bounce/complaint notifications to originate from"
}

variable "to_address" {
  type        = string
  default     = "help@example.com"
  description = "Email address to send bounce/complaint notifications to"
}

variable "environment" {
  type        = string
  default     = "test"
  description = "Descriptor for the email environment"
}

variable "log_level" {
  type        = string
  default     = "INFO"
  description = "Lambda log level"
}

variable "tags" {
  type        = map
  default     = {}
  description = "Map of tags to assign to the module resources"
}
