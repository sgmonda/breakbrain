#!/bin/bash

cd ./public/js/
rm *-min.js;
java -jar /usr/share/yuicompressor/build/yuicompressor-2.4.7.jar -o '.js$:-min.js' *.js
cd ../css/
rm *-min.css;
java -jar /usr/share/yuicompressor/build/yuicompressor-2.4.7.jar -o '.css$:-min.css' *.css
cd ../../

