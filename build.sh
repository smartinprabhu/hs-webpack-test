#!/bin/bash

rm -rf ./dist
rm -rf ./build

# # these are common env for all
export VERSION=v4/
export GRANYTYPE=password
export REFRESHGRANTTYPE=refresh_token
export GOOGLE_API_KEY=AIzaSyCZP-bkwcoGJj9KLsAU10VgodNr5teA_X4
export IS_USE_APIGATEWAY=false
export GOOGLE_CAPTCHA_SITE_KEY=6LfzYzUfAAAAADFX4l4BMj2hzXVxf30aPXoTaoQP
export GOOGLE_CAPTCHA_SECRET_KEY=6LfzYzUfAAAAADQ_aoQLU8_8NRaCsIY5kQj876Gq
export SERVER_PORT=3050
export REACT_APP_WEB_URL=http://localhost:3050

yarn run prod

mkdir ../hsense

rm -rf ../hsense/server.js
rm -rf ../hsense/server.js
rm -rf ../hsense/dist

cp ./server.js ../hsense/
echo "copied server.js file"
cp -R ./dist ../hsense/
echo "copied dist folder"
cp package.json ../hsense/
echo "copied package.json file"
cp powerBi.js ../hsense/
echo "copied PowerBI file"
cp env-1 ../hsense/dist/env.js

echo "List of files or folders in hsense directory: `ls -lrth ../hsense`"

echo "Start the node service"
node ../hsense/server.js