import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

// SNS client
const snsClient = new SNSClient({ region: "us-east-1" });

// Replace with your SNS Topic ARN
const topicArn = "arn:aws:sns:us-east-1:479361731047:event-announcements-topic";

export const handler = async (event) => {
  // 0) Simple API key protection (optional but recommended)
  const expectedKey = process.env.PUBLIC_API_KEY;
  const headers = event?.headers || {};
  const providedKey =
    headers["x-api-key"] || headers["X-Api-Key"] || headers["X-API-KEY"];

  if (expectedKey && providedKey !== expectedKey) {
    return {
      statusCode: 401,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Unauthorized" }),
    };
  }

  // 1) Ensure request body exists
  if (!event?.body) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Request body is required." }),
    };
  }

  // 2) Parse JSON safely
  let payload;
  try {
    payload = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
  } catch {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Invalid JSON format." }),
    };
  }

  // 3) Extract and sanitize fields
  const title = (payload?.title ?? "").trim();
  const date = (payload?.date ?? "").trim();
  const message = (payload?.message ?? "").trim();

  // 4) Validate required fields
  const missingFields = [];
  if (!title) missingFields.push("title");
  if (!date) missingFields.push("date");
  if (!message) missingFields.push("message");

  if (missingFields.length > 0) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Missing required field(s): ${missingFields.join(", ")}`,
      }),
    };
  }

  // 5) Validate date format (YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Invalid date format. Use YYYY-MM-DD." }),
    };
  }

  // 6) Prepare SNS message
  const messageBody = `Event: ${title}\nDate: ${date}\nDetails: ${message}`;

  const params = {
    TopicArn: topicArn,
    Subject: `New Event Announcement: ${title}`,
    Message: messageBody,
  };

  // 7) Publish to SNS
  try {
    const command = new PublishCommand(params);
    await snsClient.send(command);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Event announcement sent successfully!" }),
    };
  } catch (error) {
    console.error("SNS publish error:", error);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: "Failed to publish event announcement." }),
    };
  }
};
