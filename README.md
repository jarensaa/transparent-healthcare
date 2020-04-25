# A blockchain platform for transparent

Proof of concept blockchain platform for transparent trustevaluation in healthcare.

## Quickstart

```
$ docker-compose up
```

### Rebuild images

Images does not build by default on changes. To rebuild:

```
$ docker-compose build
```

## Manual setup

When developing on the application, you probably want to run the services manually.To do this, follow this procedure:

1. Open a terminal window and navigate to the `ganache` folder.
2. Run `yarn install` and `yarn start`
3. Open another terminal window and navigate to the `contracts` folder.
4. Run `yarn install` and `yarn start`
5. Open another terminal window and navigate to the `providerService` folder.
6. Run `./gradlew bootRun`
7. Open another terminal window and navigate to the `webapp` folder.
8. Run `yarn install` and `yarn start`
