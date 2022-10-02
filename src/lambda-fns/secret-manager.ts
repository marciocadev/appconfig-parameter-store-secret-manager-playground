import 'source-map-support/register';
import { SecretsManagerClient, GetSecretValueCommand, GetSecretValueCommandInput } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: process.env.AWS_REGION });

export const handler = async() => {
  const input: GetSecretValueCommandInput = {
    SecretId: process.env.SECRET_MANAGER_ID,
  };
  const response = await client.send(new GetSecretValueCommand(input));
  console.log(JSON.parse(response.SecretString!));
};