## Prerequisites
1. Run the ganache blockchain in `../ganache` with `yarn start`
2. Run a contract compile and migration in `../contracts` with `truffle migrate`

## Development
Use intellij for development on the project

#### Enable annotation processing
The program uses some annotation processing, for example for Immutables. (read: java records were not in LTS during writing)
Annotation processing must be enabled in intellij for the best experience

Do so under `file > settings > Build, execution, deployment > Compiler > annotation processors`


## Running application
```
./gradlew bootRun
```
