#!/bin/bash

defaultUrl=http://localhost:4000
url=${APOLLO_URL:-${defaultUrl}}

[ $# -ne 1 ] && echo query.sh graphqlQueryFile && exit -1

graphqlQuery=$(cat $1 | sed 's/"/\\"/g' | tr -d '\n')

echo "{\"query\": \"${graphqlQuery}\"}"

curl -i -X POST --data "{\"query\": \"${graphqlQuery}\"}" -H "Content-Type: application/json" $url