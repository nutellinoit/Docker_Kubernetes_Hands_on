FROM node:8.1.3

RUN apt-get -y update && \
    apt-get -y install vim wget curl

WORKDIR /kubeprimer-api/

ADD rootfs /

CMD ["npm", "start"]
