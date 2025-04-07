import * as process from "process";

export default () => ({
  port: parseInt(process.env.PORT, 10),
  awsConfiguration: {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
  },
    awsQueueUrl : process.env.AWS_SQS_QUEUE_URL,
    awsDynamoTableName : process.env.AWS_DYNAMO_DB_TABLE,
    awsS3BucketName : process.env.AWS_S3_BUCKET_NAME
});
