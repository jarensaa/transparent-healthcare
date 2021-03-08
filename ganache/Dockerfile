FROM node:12
COPY . .
EXPOSE 8545
RUN yarn install
CMD yarn run clean && yarn start-in-docker