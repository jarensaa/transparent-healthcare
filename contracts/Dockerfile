FROM node:12
COPY . .
RUN yarn install
RUN yarn build
RUN apt-get update
RUN apt-get install dos2unix
RUN dos2unix wait-for-it.sh
CMD yarn start