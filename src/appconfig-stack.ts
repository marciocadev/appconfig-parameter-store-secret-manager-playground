import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { CfnApplication, CfnConfigurationProfile, CfnDeployment, CfnDeploymentStrategy, CfnEnvironment, CfnHostedConfigurationVersion } from 'aws-cdk-lib/aws-appconfig';
import { Construct } from 'constructs';
import * as templateConfiguration from './env/template.json';

export class AppConfigStack extends NestedStack {

  public readonly application: CfnApplication;
  public readonly configurationProfile: CfnConfigurationProfile;
  public readonly hostedConfigurationVersion: CfnHostedConfigurationVersion;
  public readonly appConfigEnvironment: CfnEnvironment;

  constructor(scope: Construct, id: string, props: NestedStackProps = {}) {
    super(scope, id, props);

    this.application = new CfnApplication(this, 'AppConfigApplication', {
      name: 'appconfig-application',
    });

    this.configurationProfile = new CfnConfigurationProfile(this, 'AppConfigConfigurationProfile', {
      applicationId: this.application.ref,
      locationUri: 'hosted',
      name: 'appconfig-configuration-profile',
    });

    const deploymentStrategy = new CfnDeploymentStrategy(this, 'AppConfigDeploymentStrategy', {
      deploymentDurationInMinutes: 0,
      growthFactor: 100,
      name: 'appconfig-deployment-strategy',
      replicateTo: 'NONE',
    });

    this.appConfigEnvironment = new CfnEnvironment(this, 'appconfig-environment', {
      applicationId: this.application.ref,
      name: 'environment',
    });

    this.hostedConfigurationVersion = new CfnHostedConfigurationVersion(this, 'AppConfigHostedConfigurationVersion', {
      applicationId: this.application.ref,
      configurationProfileId: this.configurationProfile.ref,
      content: JSON.stringify(templateConfiguration),
      contentType: 'application/json',
    });

    new CfnDeployment(this, 'AppConfigDeployment', {
      applicationId: this.application.ref,
      configurationProfileId: this.configurationProfile.ref,
      configurationVersion: this.hostedConfigurationVersion.ref,
      deploymentStrategyId: deploymentStrategy.ref,
      environmentId: this.appConfigEnvironment.ref,
    });
  }
}