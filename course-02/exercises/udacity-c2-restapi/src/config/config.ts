export const config = {
  "dev": {
    // "username": "postgres",
    // "password": "udagramfolakemidev",
    // "database": "udagramfolakemidev",
    // "host": "udagramfolakemidev.codr6lp1ki9n.us-east-1.rds.amazonaws.com",
    // "dialect": "postgress",
    "username": process.env.POSTGRES_USERNAME,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DATABASE,
    "host": process.env.POSTGRES_HOST,
    "dialect": process.env.DIALECT,
    "aws_region": process.env.AWS_REGION,
    "aws_profile": process.env.AWS_PROFILE,
    "aws_media_bucket": process.env.AWS_MEDIA_BUCKET
    // "username": process.env.POSTGRES_USERNAME,
    // "password": process.env.POSTGRES_PASSWORD,
    // "database": process.env.POSTGRES_DATABASE,
    // "host": process.env.POSTGRES_HOST,
    // "dialect": process.env.DIALECT,
    // "aws_region": process.env.AWS_REGION,
    // "aws_profile": process.env.AWS_PROFILE,
    // "aws_media_bucket": process.env.AWS_MEDIA_BUCKET
  },
  "jwt": {
    "secret": "helloworld"
  },
  "prod": {
    "username": "",
    "password": "",
    "database": "udagram_prod",
    "host": "",
    "dialect": "postgres"
  }
}
