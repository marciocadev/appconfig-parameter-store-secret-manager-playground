import { NestedStack, NestedStackProps } from 'aws-cdk-lib';
import { ParameterDataType, StringParameter, StringListParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';

export interface ParameterStoreStackProps extends NestedStackProps {
  readonly parameterStoreStringParameter: string;
  readonly parameterStoreArrayParameter: string[];
}

export class ParameterStoreStack extends NestedStack {

  public readonly stringParameter: StringParameter;
  public readonly stringListParameter: StringListParameter;

  constructor(scope: Construct, id: string, props: ParameterStoreStackProps) {
    super(scope, id, props);

    this.stringParameter = new StringParameter(this, 'StringParameter', {
      stringValue: props.parameterStoreStringParameter,
      parameterName: '/my-param/string-parameter',
      dataType: ParameterDataType.TEXT,
    });

    this.stringListParameter = new StringListParameter(this, 'StringListParameter', {
      stringListValue: ['props.parameterStoreArrayParameter'],
      parameterName: '/my-param/string-list-parameter',
    });
  }
}