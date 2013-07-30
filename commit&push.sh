#!/bin/bash
t=$(date);
git add .
git commit -a -m "$t";
git push origin master;

