# Use a lightweight Nginx image to serve the static site
FROM nginx:1.27-alpine

# Replace the default server configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static assets
COPY . /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
