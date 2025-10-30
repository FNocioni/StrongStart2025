#!/bin/env bash

# SHOW DATABASES;
# USE strongstart2025;
# SHOW TABLES;
# SELECT * FROM users

# INSERT INTO users (id, first_name, last_name, username, email, password, created_at)
# VALUES (6, 'dummyfirst', 'dummylast', 'dummyusername', 'dummypassword', '???');

function ensureBinaryExists() {
	command -v "$1" >/dev/null 2>&1 || { echo >&2 "[\"$1\" is required to run, but \"$1\" was not found in \$PATH. Aborting...]"; exit 1; }
}

ensureBinaryExists cat
ensureBinaryExists grep
ensureBinaryExists sed
ensureBinaryExists mariadb

if [ ! -f './.env' ]; then
	echo 'file "./.env" not found!'
	echo 'make sure to ask your mentor and teammates for details'
	exit
fi

host=$(cat .env | grep 'DB_HOST' | sed 's/.*=//')
user=$(cat .env | grep 'DB_USER' | sed 's/.*=//')
pass=$(cat .env | grep 'DB_PASS' | sed 's/.*=//')
port=$(cat .env | grep 'DB_PORT' | sed 's/.*=//')
name=$(cat .env | grep 'DB_NAME' | sed 's/.*=//')

mariadb -h "$host" -u "$user" -p"$pass" -P "$port" -D "$name" --skip-ssl
