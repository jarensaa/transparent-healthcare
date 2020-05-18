# VerifyMed -  A blockchain platform for transparent trust in virtualized healthcare

This is repository contains the code for the platform presented in: Rensaa et al. _VerifyMed - A blockchain platform for transparent trust in virtualized healthcare: Proof-of-concept_, to be presented at Blockchain and Internet of Things Conference (BIOTC 2020)

Read the paper at:
- [arXiv link (Reccomended)]()
- [Official BIOTC2020 link; to appear]()

## Testing the platform

### Quickstart
The following will build and start the platform:

```
$ docker-compose up
```

#### Rebuild images

Images does not build by default on changes. To rebuild:

```
$ docker-compose build
```

## Development setup

When developing on the application, you probably want to run the services manually. 

### Requirements 

- Java 11 
- Node v12

Technologies:
```
contracts
| Solidity
| Truffle
ganache
| Ganache-cli
providerService
| Gradle
| Spring-boot
| Web3j
webapp
| Reactjs
| Typescript
| Web3js
| Blueprintjs
| Styled-compoenents
```

### Startup

To do this, follow this procedure:

1. Open a terminal window and navigate to the `ganache` folder.
2. Run `yarn install` and `yarn start`
3. Open another terminal window and navigate to the `contracts` folder.
4. Run `yarn install` and `yarn start`
5. Open another terminal window and navigate to the `providerService` folder.
6. Run `./gradlew bootRun`
7. Open another terminal window and navigate to the `webapp` folder.
8. Run `yarn install` and `yarn start`

## Citation

```
@inproceedings{rensaa2020VerifyMed,
  author = {
    Jens-Andreas. H. Rensaa and Danilo Gligoroski and Katina Kralevska and Anton Hasselgren and Arild Faxvaag},
  title = {VerifyMed - A blockchain platform for transparent trust in virtualized healthcare: Proof-of-concept},
  booktitle = {BIOTC},
  year = {2020}
}
```
