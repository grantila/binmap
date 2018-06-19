#!/bin/sh

rm -rf dist build-test

node_modules/.bin/tsc -p .

node_modules/.bin/tsc -p ./tsconfig-test.json
