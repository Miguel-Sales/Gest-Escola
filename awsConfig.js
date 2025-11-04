import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIAZYPPXAY47OHPQE64";
const AWS_SECRET_ACCESS_KEY = "/8IFstjZtGLYe6d1pnGesgzo7eQ39JOcDMW7B5bX";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEKD//////////wEaCXVzLXdlc3QtMiJHMEUCIC+Vkjv7/rre7YsDZr1A8CJIQyprhJt33mLGQt3atfBKAiEAkUTPPFMj8PlQlWmE0K+nsj2xg8WpoHM/6VAbaeO830gquAIIaBAAGgw2NzEwNTQ0OTczMzciDNSKmFkFHZA5W4vfUCqVAspY0HbtyS5OyJIMm9OWU3k+ff0m0nz49RwOzrZ7cYjzTq0N25sitM6ivmaYYIoaamSl6Pr4aVy1meGmeMGG92pW5LDkBileuLCaohyLe519ojI9TSQ+WANrdXxjkQSNxLFd4B7mDRN/dznkIhco6F86X/6chXsDll4KvwAnb/Svv2sp4mrFZO3jJC0RrJuOFkE6hh/9Kf6Bjp2HuSKyMTT33utiA9rjCOJnSAzqml5oXS6tohK0JcJRavOI1l8VffLOJq+Sc7EjRSRRV5Wrv2r2S/OklRHctFY1xDK3aLPkgFtTsneeEjjbt48dwisSzjiPMlbH5eVU7bot+kb49JhFmBe23k/si2EHQkFpD6gPQsFuCAIws/CkyAY6nQFwO5bmQ8m9R0Jbv9pSSXvj7qVvcbwrReo/z4msUMCaHfFl3LAV+ACGGrlYN9UZKKlqFACZRMpPPpf5pOVxYKI3qJpWN/xGvnHKa0JdR5YES2R6Vro1TnrvnKJ50VaBJKFcLGrcpzX4J0Osj6pvMuXiC2bRLmO5id+giCFMoH+bNfgXzfrVli1VSWSqWZCJuZI0huqmJsG/jwNiuN6+";

// Região da AWS (ajuste se for diferente)
const REGION = "us-east-1";

// Configuração do DynamoDB
export const dynamoDB = new DynamoDBClient({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN, // apenas se estiver usando credenciais temporárias
  },
});

// Configuração do S3 (caso use upload de imagens)
export const s3 = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
    sessionToken: AWS_SESSION_TOKEN,
  },
});

export default dynamoDB;
