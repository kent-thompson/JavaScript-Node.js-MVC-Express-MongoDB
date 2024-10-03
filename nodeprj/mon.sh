#!/bin/bash

mongod --fork --dbpath /var/lib/mongodb  --logpath /var/log/mongodb/mongodb.log
