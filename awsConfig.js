import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIA47CRZHOBWINBYUJI";
const AWS_SECRET_ACCESS_KEY = "tUgq3Bm/M2xXj0BKsWbICvRP95bNEFOwy6PwjgHG";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEKz//////////wEaCXVzLXdlc3QtMiJGMEQCICsVXhcb1dvOAyyNmoDhbJm5g62WVmGoAo7GBCtsI3BeAiA+BS27HXORn8u+YRbVE2PRlo047tna8ul9wVQz3u1opSrCAgh1EAAaDDg5MTM3NzIzNjg2NyIMvqBq8P1nbb+HRtT/Kp8C3GqLkk2z4KuWu/+6oWg3QfE1yt34Ve+JjAu+BQlO0DqMcEF0mIudhMI3q6OcAHKOdWsJcJGtK/Lywb9XD5AgKpWtvonfOOicUhmkGTUTBMPcsPJH1T5anL3noNxWaBCEQ/N8Iq2KqJJlQDkLeYrBbeEskfrA1eHG8/KpQ3xicBnIXFBEX4w5R1Q/TXBz2GhEXcBUnijUJ1pTO3a9VGkGjWr9VMJ9vB7wwQX6f7cfh1X6u7cJx9dYpJYD+XbIvRCHzeaSjxSuBfsZBFbB3NgRL36ArMQxemeaFbPopz4SlMd/pmpdwujZjPmbS9bVYgRWPN9uA0SuQrcMsDzaMbVfdYqkZ8rGdpeAxyqQxDprt1zpfYEkdKBdVNhq1RaL2uAwvc6nyAY6ngHp+FGQZ4AvhRMjOOFaqTUXJDxHl3B/mv0JjKTD2l3Hc6Qym2OxADalFieU/AC9yjSH7xf05xBERKguH3M2JzG13g0FUv0Q7CanJAZSsQrIO2AEj8XDffMSi2RrIa72StifhNZfjMK406qHLbklzuD8dNmvNc8Eu0BonXAuKJBO7bgQLLAG6bQ9JGlfs3pN2W5DtKxXZMXW9cuWFlU60A==";

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

export default dynamoDB;
