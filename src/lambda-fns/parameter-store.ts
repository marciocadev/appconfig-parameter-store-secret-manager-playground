import { SSMClient, GetParameterCommand, GetParameterCommandInput } from '@aws-sdk/client-ssm';

const client = new SSMClient({ region: process.env.AWS_REGION });

export const handler = async() => {

  const ssmStringParameterInput: GetParameterCommandInput = {
    Name: process.env.STRING_PARAMETER,
  };
  const ssmStringParameterResponse = await client.send(new GetParameterCommand(ssmStringParameterInput));
  console.log(ssmStringParameterResponse.Parameter?.Value);


  const ssmStringListParameterInput: GetParameterCommandInput = {
    Name: process.env.STRING_LIST_PARAMETER,
  };
  const ssmStringListParameterResponse = await client.send(new GetParameterCommand(ssmStringListParameterInput));
  console.log(ssmStringListParameterResponse.Parameter?.Value);
};