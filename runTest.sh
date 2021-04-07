#!/bin/bash

cd /opt/msgapp
eslint server.js

cd /var/www/msgapp
eslint main.js
eslint message.js
eslint user.js

cd /opt/msgapptest
npm test

