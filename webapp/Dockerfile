FROM node
COPY . .
RUN yarn install
RUN yarn build --production

FROM nginx:alpine
COPY --from=0 ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=0 ./nginx/nginx.server.conf /etc/nginx/conf.d/default.conf
COPY --from=0 build /usr/share/nginx/html