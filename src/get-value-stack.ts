import { join } from 'path';
import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { CfnApplication, CfnConfigurationProfile, CfnEnvironment, CfnHostedConfigurationVersion } from 'aws-cdk-lib/aws-appconfig';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LayerVersion } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { StringListParameter, StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export interface GetValueStackProps extends NestedStackProps {
  ssmStringParameter: StringParameter;
  ssmStringListParameter: StringListParameter;

  appConfigApplication: CfnApplication;
  appconfigEnvironment: CfnEnvironment;
  appConfigConfigurationProfile: CfnConfigurationProfile;
  appconfigHostedConfigurationVersion: CfnHostedConfigurationVersion;
}

export class GetValueStack extends NestedStack {
  constructor(scope: Construct, id: string, props: GetValueStackProps) {
    super(scope, id, props);

    const lmbParameterStore = new NodejsFunction(this, 'ParameterStoreLambda', {
      entry: join(__dirname, 'lambda-fns/parameter-store.ts'),
      handler: 'handler',
      environment: {
        STRING_PARAMETER: props.ssmStringParameter.parameterName,
        STRING_LIST_PARAMETER: props.ssmStringListParameter.parameterName,
      },
    });
    props.ssmStringParameter.grantRead(lmbParameterStore);
    props.ssmStringListParameter.grantRead(lmbParameterStore);

    const lmbAppConfigSdk = new NodejsFunction(this, 'AppConfigSdkLambda', {
      entry: join(__dirname, 'lambda-fns/app-config-sdk.ts'),
      handler: 'handler',
      environment: {
        APPLICATION_ID: props.appConfigApplication.ref,
        CONFIGURATION_PROFILE_ID: props.appConfigConfigurationProfile.ref,
        HOSTED_CONFIGURATION_VERSION_ID: props.appconfigHostedConfigurationVersion.ref,
      },
    });
    const appConfigSdkPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['appconfig:GetHostedConfigurationVersion'],
      resources: [`arn:aws:appconfig:${process.env.CDK_DEFAULT_REGION}:${process.env.CDK_DEFAULT_ACCOUNT}:*`],
    });
    console.log(process.env);
    lmbAppConfigSdk.addToRolePolicy(appConfigSdkPolicy);

    const appconfigArn = 'arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension:82';
    const layer = LayerVersion.fromLayerVersionArn(this, 'AppConfigLayer', appconfigArn);
    const lmbAppConfigUrl = new NodejsFunction(this, 'AppConfigUrlLambda', {
      entry: join(__dirname, 'lambda-fns/app-config-url.ts'),
      handler: 'handler',
      environment: {
        AWS_APPCONFIG_EXTENSION_POLL_INTERVAL_SECONDS: '45',
        AWS_APPCONFIG_EXTENSION_POLL_TIMEOUT_MILLIS: '3000',
        AWS_APPCONFIG_EXTENSION_HTTP_PORT: '2772',
        APPLICATION_ID: props.appConfigApplication.ref,
        ENVIRONMENT_ID: props.appconfigEnvironment.ref,
        CONFIGURATION_PROFILE_ID: props.appConfigConfigurationProfile.ref,
      },
      layers: [layer],
    });
    const appConfigUrlPolicy = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: [
        'appconfig:StartConfigurationSession',
        'appconfig:GetLatestConfiguration',
      ],
      resources: [`arn:aws:appconfig:${process.env.CDK_DEFAULT_REGION}:${process.env.CDK_DEFAULT_ACCOUNT}:*`],
    });
    lmbAppConfigUrl.addToRolePolicy(appConfigUrlPolicy);
  }
}