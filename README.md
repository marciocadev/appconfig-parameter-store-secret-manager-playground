# replace this

```bash
cdk deploy --context ParameterStoreStringParameter=string-parameter \
--context ParameterStoreArrayParameter=first-param,second-param \
--context SecretParameter=S0f1@2011
```

```bash
cdk destroy --context ParameterStoreStringParameter=string-parameter \
--context ParameterStoreArrayParameter=first-param,second-param \
--context SecretParameter=S0f1@2011
```
