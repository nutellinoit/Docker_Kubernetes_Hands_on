FROM node:7.8.0


ENV HOME=/home/app

COPY package.json $HOME/publisher/

USER root
WORKDIR $HOME/publisher
RUN npm install

CMD ["node", "publisher.js"]