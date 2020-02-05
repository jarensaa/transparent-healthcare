FROM node
COPY . .
RUN yarn install
RUN yarn build --production

FROM nginx:alpine
COPY --from=0 build /usr/share/nginx/html