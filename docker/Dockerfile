FROM dadhx05.interno:9092/oidigital/alpine-node8

COPY package.json package.json
RUN  npm install

USER root
COPY . .

RUN  chown -R app:appgrp .
USER app

CMD npm start