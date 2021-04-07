#!/bin/bash

cd /opt/msgapptest
eslint server.js

cd /var/www/msgapp
eslint login.js
eslint main.js
eslint message.js
eslint user.js

cd/opt/msgapptest
npm test

