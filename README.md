# Event Announcement System (Serverless)
A serverless event announcement system built on AWS.
This project allows users to submit event details through a web interface, which are processed by a backend API and distributed to subscribers via email notifications. All without managing servers.

## Architecture Overview
**Workflow**
1. User submits event details through a static web interface hosted on Amazon S3
2. The browser sends a POST request to Amazon API Gateway
3. API Gateway invokes an AWS Lambda function
4. Lambda validates the request and publishes the announcement to Amazon SNS
5. SNS delivers the announcement to subscribed email recipients
6. Logs are stored in Amazon CloudWatch for monitoring and debugging

## AWS Services Used
- **Amazon S3** – Static website hosting for the frontend
- **Amazon API Gateway (HTTP API)** – Public API endpoint
- **AWS Lambda** – Serverless backend logic
- **Amazon SNS (Simple Notification Service)** – Event notifications via email
- **Amazon CloudWatch** – Logging and monitoring
- **AWS IAM** – Secure service-to-service access

## Step-by-Step Setup Guide
### 1️⃣ Create SNS Topic and Subscription
1. Open **Amazon SNS**
2. Go to **Topics → Create topic**
3. Type: **Standard**
4. Topic name:
   ```
   event-announcements-topic
   ```
5. Create topic

**Add Email Subscription**
1. Open the created topic
2. Go to **Subscriptions → Create subscription**
3. Protocol: **Email**
4. Endpoint: your email address
5. Create subscription
6. Confirm the subscription from your email inbox

### 2️⃣ Create IAM Role for Lambda
1. Open **IAM → Roles → Create role**
2. Trusted entity:
   - AWS service
   - Use case: **Lambda**
4. Attach policies:
   - `AmazonSNSFullAccess`
   - `AWSLambdaBasicExecutionRole`
5. Role name:
   ```
   EventAnnouncementLambdaRole
   ```
6. Create role

### 3️⃣ Create Lambda Function
1. Open **AWS Lambda → Create function**
2. Select **Author from scratch**
3. Function name:
   ```
   PublishEventAnnouncement
   ```
4. Runtime:
   ```
   Node.js 20.x / 22.x / 24.x
   ```
5. Architecture: Default
6. Permissions:
   - Choose **Change default execution role**
   - Select **EventAnnouncementLambdaRole**
7. Create function

### 4️⃣ Configure Lambda Settings
**Timeout**
1. Configuration → General configuration
2. Set timeout:
   ```
   30 seconds
   ```
3. Save

**Environment Variables**
Configuration → Environment variables → Add:
| Key            | Value        |
| -------------- | ------------ |
| PUBLIC_API_KEY | demo-key-123 |















































































