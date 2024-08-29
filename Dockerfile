# build environment
FROM node:18.16.0 as build
WORKDIR /apps
# COPY package.json .
# RUN npm install --legacy-peer-deps
# COPY . .
COPY ./build /apps/build
# RUN npm run build

# production environment
FROM nginx:1.15.2-alpine
COPY ./build /var/www/apps/incident
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
ENTRYPOINT ["nginx","-g","daemon off;"]
