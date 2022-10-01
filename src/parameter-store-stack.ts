import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { ParameterDataType, StringParameter, StringListParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export class ParameterStoreStack extends NestedStack {

  public readonly stringParameter: StringParameter;
  public readonly stringListParameter: StringListParameter;

  constructor(scope: Construct, id: string, props: NestedStackProps = {}) {
    super(scope, id, props);

    this.stringParameter = new StringParameter(this, 'StringParameter', {
      stringValue: 'my string value',
      parameterName: '/my-param/string-parameter',
      dataType: ParameterDataType.TEXT,
    });

    this.stringListParameter = new StringListParameter(this, 'StringListParameter', {
      stringListValue: ['first-string', 'second-string'],
      parameterName: '/my-param/string-list-parameter',
    });
  }
}