import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = "ASIA47CRZHOB4QGKYHVS";
const AWS_SECRET_ACCESS_KEY = "6r4edg8xAKfA9+8/ehRgbJnTO37xvD6vwYTvDcrz";
const AWS_SESSION_TOKEN = "IQoJb3JpZ2luX2VjENv//////////wEaCXVzLXdlc3QtMiJGMEQCIGoVOyT8LsG6BkLQqkVJPtFsywonLPkTJh7NLDQC6hvwAiAUde8FZjiLtTC5EwjfQa9B4HZzekIXDo4vFuSFslLSXyrLAgik//////////8BEAAaDDg5MTM3NzIzNjg2NyIMyLoV3FBanm4GbDWQKp8CLC+3Mz4KGuDr97Rb7ga2fKJU1YdVQ+mmtR+gqQ+HtcDvoG77mGqVqepWGNLe2FSAcogL1rW0NSBJ+zwg5WB355qDAht8ALt5/2k31rP83C2klG50yN9/7siwDALLFifY05mCc1nZ7I6cEe218iVQNGrhcod7d/lkXsWOumJvAtjZNbMIJ2sqOhUofVYZ9L2YZa+YgbjfRhgAoQD0s7mwLBH5E6Op8G+J1Xek9kViTY8Fs7c+N61PJ9i5eaACcNXOfmhHNEkMjMxBtyijAhQjEm6D5gtmy8CDwK14gskJ5ybPDfKVy960QZUXMyiFMfoki7K1H8HOFqIQ52HGAdEXP3MQ97tCj4dGCXxA8Z3iXLnaQnE+yXZyBvdlLkXp5B0wmYGyyAY6ngFQ0vAdQb1EVqn5zWtzezLgDKTPTkzaYZO9jXyseqRtpvjV8d+v36WOu/bgGbSkW+xJfaKdguVyEVkMvEusecjUdldrvz/mylueu3goezUQKLbyU1YygLv8zNvDtPxhm9Qe4kDX3/BYoXFA4qjUP09qdff67UOqj0J5mD+N1C+LwDs3pa9uhY252H3lwa0W/KpJlMRjHlDTPPfVAd6IRQ==";

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
