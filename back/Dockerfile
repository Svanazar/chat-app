FROM node:16.3.0
RUN mkdir /app && chown node:node /app
USER node
WORKDIR /app
COPY --chown=node:node package.json package-lock.json ./
RUN npm install