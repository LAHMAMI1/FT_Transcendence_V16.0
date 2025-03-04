FROM nginx:alpine

RUN apk add --no-cache openssl

WORKDIR /etc/nginx

COPY nginx.conf ./

COPY script.sh ./

RUN chmod +x script.sh

EXPOSE 443

ENTRYPOINT ["./script.sh"]