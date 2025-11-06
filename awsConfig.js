import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIA47CRZHOBV22TGCWR";
const AWS_SECRET_ACCESS_KEY = "RuJeEUd41fI07AhGJ9h25+OvQouiHEAOP1bi1lps";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjEND//////////wEaCXVzLXdlc3QtMiJHMEUCIQDJm5G24NQaOQdIdiYri5wXrDE4UFk459dxYoGRCptm6gIgGfjcu0NWV4A/Sno2U6APVkwmV/gxM++8igYCS07kU4EqywIImf//////////ARAAGgw4OTEzNzcyMzY4NjciDDMqtFxp9+cXsSVfHiqfAsxvGg4AsOdvRhBWbjX7YjCZr53gXw5MH/Cf3ftLwyDGIkd6FjdFMmpbqLQZc8VUKDGQNs7JS2pwQUB4GS4CDSSLxSZUZrTjk/QZy+GQ8TSVXiJr2ckJ9K9M4j7D9v/VRtUTkDQa9SVqw9u/B8C1YkP628MXlBwM/2kKd3GFvqVuq98rds+q5GCBO8xO8n9aft+uerCT1cU8rhuDVOS7hSUP+XoNjjwb/GEWzk8cz8fYqkLec66BJSLjLXpkX/cjV9HpFYbp5XtZLMC19yvimW43SqTlatpewb/1JXyWCNRXAKbt09iFPoCKG8CF1xrzQb3wAzaf2VZwompCKuJ5WgZgiU9K4Aa6Peoj3zI+kwcwcFVj0/LYzpokUblXwWluMP7Dr8gGOp0BgJVuKuweD6fGgRafsi/QUxOGvyBI0C8l/G2qHEyTsJ2tFdt/ir/fqm4+7MyVCNXUrA13JBRxm08nkAmV/lGWSTsXtSMLame3e/+NBkvumYrvxoWCdiRu4OYZseoe2nTZ/UQp7UBx350hPVvKfjwVPoIf1Q2Ble1WQLjyLuhl+RoDVheJhYxs4CesBOorpW8ttnhtRjogBhqdWtASWA==";
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
