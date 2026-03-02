# TechBlog Infrastructure Deployment

This directory contains the Infrastructure as Code (CloudFormation) templates to deploy the TechBlog application to AWS.

## Architecture
- **Network**: VPC, Public/Private Subnets, NAT Gateways
- **Compute**: AWS App Runner (Next.js Application)
- **Database**: Amazon RDS for PostgreSQL
- **Storage**: Amazon S3 (Image Assets)
- **Security & Secrets**: AWS Secrets Manager, IAM Roles, Security Groups

## Prerequisites
1. [AWS CLI installed and configured](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) with appropriate permissions.
2. A temporary S3 bucket to store CloudFormation templates before deployment.

## Deployment Steps

Deploying nested stacks requires uploading the `stacks/` directory to an S3 bucket first.

### Step 1: Create an S3 Bucket for Templates
Create an S3 bucket in your deployment region to store these templates.

```bash
# Create the bucket (replace with your unique bucket name)
aws s3 mb s3://my-techblog-cfn-templates
```

### Step 2: Upload Templates to S3
Upload all templates in the `stacks/` directory to your S3 bucket.

```bash
aws s3 sync ./infrastructure/stacks s3://my-techblog-cfn-templates/infrastructure/stacks/
```

### Step 3: Configure Parameters
Edit the `infrastructure/parameters/dev.json` file and update the `TemplateBucketName` to the bucket you created in Step 1.

If your AWS account already has a GitHub OIDC Provider configured (for `token.actions.githubusercontent.com`), find its ARN in the IAM Console and set it as `GitHubOIDCProviderArn` in the parameters JSON. Otherwise, leave it empty `""` to let this stack create it.

```json
[
  // ...
  {
    "ParameterKey": "TemplateBucketName",
    "ParameterValue": "my-techblog-cfn-templates" // UPDATE THIS
  },
  {
    "ParameterKey": "GitHubOIDCProviderArn",
    "ParameterValue": "" // UPDATE THIS (Optional)
  }
]
```

### Step 4: Deploy the Root Stack
Run the following command to deploy the entire infrastructure for the `dev` environment.

```bash
aws cloudformation create-stack \
  --stack-name techblog-dev \
  --template-body file://infrastructure/main.yaml \
  --parameters file://infrastructure/parameters/dev.json \
  --capabilities CAPABILITY_NAMED_IAM CAPABILITY_AUTO_EXPAND
```

### Step 5: (Post-Deployment) Populate Secrets
Once the stack deploys successfully, you'll need to populate the generated Secrets Manager secrets:

1. **Database Secret**: The RDS DB will auto-generate a password. You and your Next.js application will use this connection string.
2. **App Secrets**: CloudFormation auto-generates a secure `JWT_SECRET`. Additional App Secrets (like optional API Keys) can be added to this secret in the AWS Console.

## Connecting App Runner & ECR
After CloudFormation execution, an empty ECR Repository named `techblog-app-dev` is created. 
1. Build and push your Next.js docker image to this ECR repository.
2. Go to the AWS App Runner console, find your service, and click "Deploy" to launch your pushed image.
