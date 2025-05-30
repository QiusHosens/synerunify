# build admin
FROM node AS builder
WORKDIR /app

COPY ./ ./

RUN cd . && \
#    npm install yarn -g --registry https://registry.npmmirror.com && \
    yarn install --registry https://registry.npmmirror.com && \
    yarn build

# build final
FROM nginx
WORKDIR /app

COPY --from=builder /app/dist /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

STOPSIGNAL SIGQUIT

CMD ["nginx", "-g", "daemon off;"]