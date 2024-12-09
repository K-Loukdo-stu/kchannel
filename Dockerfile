FROM node:14-slim
RUN apt-get update && apt-get -y install procps
WORKDIR "/app"
COPY ./package.json ./
RUN npm config set registry http://registry.npmjs.org/
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "start:prod"]