FROM node:24.15.0-slim
WORKDIR /src
ARG NODE_ENV
ARG VITE_GOOGLE_MAPS_API_KEY
# Vite bakes this into the build. Left unset, the API at api.opentour.site is used.
ARG VITE_API_URL
COPY . .
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY
RUN npm install --include=dev
ENV NODE_ENV=$NODE_ENV
RUN npm run build
EXPOSE 4200
ENTRYPOINT ["npm", "run", "start"]
