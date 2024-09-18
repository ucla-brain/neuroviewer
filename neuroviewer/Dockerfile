FROM nginx:stable-alpine as production-stage

COPY default.conf /etc/nginx/conf.d/default.conf

COPY dist /usr/share/nginx/html/neuroviewer/

EXPOSE 8000

CMD ["nginx", "-g", "daemon off;"]