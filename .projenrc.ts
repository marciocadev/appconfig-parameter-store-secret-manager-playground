import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.44.0',
  defaultReleaseBranch: 'main',
  name: 'appconfig-parameter-store-secret-manager-playground',
  projenrcTs: true,

  deps: [
    'axios',
    '@aws-sdk/client-appconfig',
    '@aws-sdk/client-ssm',
  ],
});
project.synth();