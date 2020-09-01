import application from "@application";
import AWS from "aws-sdk";

// Initialize the Amazon Cognito credentials provider
AWS.config.region = process.env.AWS_REGION; // Region
AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

application.service.fileStorage = new AWS.S3();

application.register(() => import("./routes"));
