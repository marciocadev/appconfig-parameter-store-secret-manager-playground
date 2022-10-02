import 'source-map-support/register';
import axios from 'axios';

export const handler = async() => {
  const port = process.env.AWS_APPCONFIG_EXTENSION_HTTP_PORT;
  const appId = process.env.APPLICATION_ID;
  const envId = process.env.ENVIRONMENT_ID;
  const confId = process.env.CONFIGURATION_PROFILE_ID;
  let url = `http://localhost:${port}/applications/${appId}/environments/${envId}/configurations/${confId}`;
  console.log(url);
  let configData = await axios.get(url);
  console.log(configData.data);
};