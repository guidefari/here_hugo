---
title: "Resource: Terraform"
date: 2026-02-23T16:48:43+02:00
description:
tags: [resource, iac, devops]
images: ["https://images-here-hugo.vercel.app/api/og-image?title=Terraform"]
---

capturing notes for the [Terraform Associate (004)](https://developer.hashicorp.com/certifications/infrastructure-automation) exam.

once again, [freeCodeCamp & Andrew Brown from Exam Pro](https://www.youtube.com/watch?v=SPcwo0Gq9T8) to the rescue! That was a canonical resource for my last certification.

{{<youtube SPcwo0Gq9T8>}}

---

## Imperative vs Declarative IaC Solutions

Infrastructure as Code (IaC) tools generally fall into two styles:

- Declarative: you describe the desired end state, and the tool figures out how to get there. explicit and predictable, but can be more verbose.
- Imperative: you describe the exact steps to execute, and the tool runs those steps in order. can be easier to misconfigure if logic becomes complex.

## Examples of declarative

- Terraform for multi-cloud and ecosystem breadth.
- CloudFormation when you are all-in on AWS.

### Examples of imperative

- AWS CDK for AWS-heavy teams wanting higher-level abstractions.
- Pulumi for multi-cloud with TypeScript/Python/Go/C# workflows.

---

# Provisioning vs deployment vs orchestration

## Provisioning

- To prepare a server with systems, data and software, and make it ready for network operation.
- Using Configuration Management tools like Puppet, Ansible, Chef, Bash scripts, PowerShell or
  Cloud-Init you can provision a server.
- When you launch a cloud service and configure it you are "provisioning"

## Deployment

- the act of delivering a version of your application to run a provisioned server.
- could be performed via AWS CodePipline, Harness, Jenkins, Github Actions, CircleCI

## Orchestration

- coordinating multiple systems or services.
- could be Kubernetes, Salt, Fabric

---

# Configuration drift

- TIL there are compliance tools to detect this, like AWS Config, Azure Policies, GCP Security Health Analytics
- Cloudformation has built in drift detection
- Terraform state files can help detect configuration drift
  - `refresh` and `plan` commands can help fix.

---

# Mutable vs Immutable infrastructure

## Mutable

- Traditional config management tools (Ansible, Chef, Puppet) fit this model
- Servers are updated in place — you SSH in, run scripts, apply patches
- State drifts over time. each server's history makes it unique (aka [snowflake servers](https://martinfowler.com/bliki/SnowflakeServer.html))

## Immutable

- Servers are never modified after deployment — to change anything, you replace the whole instance
- Fits naturally with Terraform, Packer, Docker, and GitOps workflows

---

# GitOps

- When you take IaC and you use a git repository to formalise how changes are deployed. Basically treating it the same as code review for application code.
- Once the code is approved, it triggers a deployment

---

# Noteable Terraform features

Terraform is a cloud agnostic IaC tool.
Configs are written in `HashiCorp Configuration Language (HCL)`

- Installable modules
- Plan and predict changes
- Dependency graphing
- State management
- The Terraform registry has 1000+ providers

## Terraform Cloud
