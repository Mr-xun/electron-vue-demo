FROM nginx:1.14.2
MAINTAINER eddy 572771336@qq.com

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist/ /etc/nginx/html
