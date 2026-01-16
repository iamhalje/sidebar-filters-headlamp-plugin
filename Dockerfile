FROM node:22-alpine AS build

WORKDIR /src

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM alpine:3.23.2

WORKDIR /plugins/sidebar-filters
COPY --from=build /src/dist/main.js ./main.js
COPY --from=build /src/package.json ./package.json
COPY --from=build /src/policy.json ./policy.json
