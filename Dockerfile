FROM nginx
EXPOSE 8080
COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /usr/share/nginx/html