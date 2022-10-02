import 'source-map-support/register';
import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppConfigStack } from './appconfig-stack';
import { GetValueStack } from './get-value-stack';
import { ParameterStoreStack } from './parameter-store-stack';
import { SecretManagerStack } from './secret-manager';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    console.log('accountId: ', Stack.of(this).account);
    console.log('region: ', Stack.of(this).region);
    console.log('availability zones: ', Stack.of(this).availabilityZones);

    const { application, configurationProfile, hostedConfigurationVersion, appConfigEnvironment } = new AppConfigStack(this, 'appconfig-stack');

    const parameterStr = this.node.tryGetContext('ParameterStoreStringParameter');
    console.log('parameter store string 👉', parameterStr);
    const parameterArr = (this.node.tryGetContext('ParameterStoreArrayParameter') as string).split(',');
    console.log('parameter store array 👉', parameterArr);
    const { stringParameter, stringListParameter } = new ParameterStoreStack(this, 'parameter-store-stack', {
      parameterStoreStringParameter: parameterStr,
      parameterStoreArrayParameter: parameterArr,
    });

    const secretStr = this.node.tryGetContext('SecretParameter');
    console.log('secret parameter 👉', secretStr);
    const { secret } = new SecretManagerStack(this, 'secret-manager-stack', {
      secretParameter: secretStr,
    });

    new GetValueStack(this, 'get-value', {
      ssmStringParameter: stringParameter,
      ssmStringListParameter: stringListParameter,
      appConfigApplication: application,
      appConfigConfigurationProfile: configurationProfile,
      appconfigHostedConfigurationVersion: hostedConfigurationVersion,
      appconfigEnvironment: appConfigEnvironment,
      secretManager: secret,
    });
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, 'appconfig-parameter-store-secret-manager-playground-dev', { env: devEnv });
// new MyStack(app, 'appconfig-parameter-store-secret-manager-playground-prod', { env: prodEnv });

app.synth();