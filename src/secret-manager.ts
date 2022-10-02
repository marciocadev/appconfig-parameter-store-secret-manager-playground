import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { Secret } from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';

export interface SecretManagerStackProps extends NestedStackProps {
  readonly secretParameter: string;
}

export class SecretManagerStack extends NestedStack {
  public readonly secret: Secret;

  constructor(scope: Construct, id: string, props: SecretManagerStackProps) {
    super(scope, id, props);

    this.secret = new Secret(this, 'Secret', {
      secretName: 'secret-manager',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ 'parameter-password': props.secretParameter }),
        generateStringKey: 'cdk-generated-password',
      },
    });
  }
}