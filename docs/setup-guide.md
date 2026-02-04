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

![Serverless Event Announcement System Architecture](/images/architecture.png)

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

### 5️⃣ Add Lambda Code
1. Go to the **Code** tab
2. Use AWS SDK v3 (@aws-sdk/client-sns)
3. Paste the finalized Lambda code
4. Update the SNS Topic ARN if required
5. Click **Deploy**

### 6️⃣ Create API Gateway (HTTP API)
1. Open **API Gateway → Create API**
2. Choose **HTTP API**
3. API name:
   ```
   event-announcement-api
   ```
4. Integration:
   - Lambda
   - Select **PublishEventAnnouncement**
5. Route:
   ```
   POST /events
   ```
6. Stage:
   - Use `$default`
   - Enable **Auto-deploy**
7. Create API

### 7️⃣ Configure CORS
1. Open the API → CORS
2. Configure:
   - Allowed origins:
     ```
     http://your-s3-website-endpoint
     ```
   - Allowed methods:
     ```
     POST, OPTIONS
     ```
   - ALlowes headers:
     ```
     Content-Type, x-api-key
     ```
   - Access-Control-Max-Age:
     ```
     3600
     ```
3. Save

### 8️⃣ Enable API Gateway Logging
1. Open API → **Stages → $default**
2. Enable Access logging
3. Log destination:
   ```
   /aws/apigw/event-announcement-api
   ```
4. Use a single line JSON log format
5. Save

### 9️⃣ Create S3 Static Website (Frontend)
1. Open Amazon S3 → Create bucket
2. Bucket name:
   ```
   event-announcement-frontend-<unique>
   ```
3. Disable **Block all public access**
4. Create bucket

**Enable Static Website Hosting**
1. Bucket → Properties → Static website hosting
2. Enable
3. Index document:
   ```
   index.html
   ```
4. Save
**Bucket Policy (Public Read)**
Allow public access for website files.

### 🔟 Upload Frontend Code
1. Create `index.html`
2. Add a form for:
   - Event title
   - Date
   - Message
3. Configure `fetch()` to call:
   ```
   POST https://<api-id>.execute-api.<region>.amazonaws.com/events
   ```
4. Include headers:
   - `Content-Type: application/json`
   - `x-api-key: demo-key-123`
5. Upload `index.html` to the bucket

### How to Test
#### Browser Test
1. Open the **S3 website endpoint**
2. Fill in the event form
3. Submit

**Expected Result**
- HTTP 200 response
- Event email received via SNS

#### API Test (Postman)
**Without API key**
- Expected: 401 Unauthorized

**With API key**
- Expected: 200 OK
- Email notification delivered

### Sample Email Output
- Event title
- Event date
- Event description

### Security Notes
- No AWS credentials are hardcoded
- IAM role follows least privilege principle
- Frontend API key is public demo-only
- In production, authentication should be handled using Amazon Cognito or backend authorization





























































