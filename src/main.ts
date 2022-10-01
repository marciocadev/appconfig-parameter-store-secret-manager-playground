import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AppConfigStack } from './appconfig-stack';
import { GetValueStack } from './get-value-stack';
import { ParameterStoreStack } from './parameter-store-stack';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const { application, configurationProfile, hostedConfigurationVersion, appConfigEnvironment } = new AppConfigStack(this, 'appconfig-stack');

    const { stringParameter, stringListParameter } = new ParameterStoreStack(this, 'parameter-store-stack');

    new GetValueStack(this, 'get-value', {
      ssmStringParameter: stringParameter,
      ssmStringListParameter: stringListParameter,
      appConfigApplication: application,
      appConfigConfigurationProfile: configurationProfile,
      appconfigHostedConfigurationVersion: hostedConfigurationVersion,
      appconfigEnvironment: appConfigEnvironment,
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