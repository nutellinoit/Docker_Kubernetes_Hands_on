FROM node:7.8.0


ENV HOME=/home/app

COPY package.json $HOME/subscriber/

USER root
WORKDIR $HOME/subscriber
RUN npm install

CMD ["node", "subscriber.js"]