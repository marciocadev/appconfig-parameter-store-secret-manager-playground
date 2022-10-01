import { AppConfigClient, GetHostedConfigurationVersionCommand, GetHostedConfigurationVersionCommandInput } from '@aws-sdk/client-appconfig';

const client = new AppConfigClient({ region: process.env.AWS_REGION });

export const handler = async() => {

  const input: GetHostedConfigurationVersionCommandInput = {
    ApplicationId: process.env.APPLICATION_ID,
    ConfigurationProfileId: process.env.CONFIGURATION_PROFILE_ID,
    VersionNumber: parseInt(process.env.HOSTED_CONFIGURATION_VERSION_ID!),
  };
  const response = await client.send(new GetHostedConfigurationVersionCommand(input));
  console.log(JSON.parse(String.fromCharCode(...(response.Content!))));
};