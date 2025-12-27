# Build Stage
FROM node:20-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Production Stage
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx config for SPA routing support
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
