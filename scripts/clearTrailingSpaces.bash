#!/bin/env bash

function ensureBinaryExists() {
	command -v "$1" >/dev/null 2>&1 || { echo >&2 "[\"$1\" is required to run, but \"$1\" was not found in \$PATH. Aborting...]"; exit 1; }
}

ensureBinaryExists sed

if [ ! -f "$1" ]; then
	echo "\"$1\" does not exist or is not a regular file!"
	echo 'aborting!'
	exit
fi

echo "linting \"$1\" ..."
sed -i 's/[\t ]\+$//' "$1"
echo 'done!'
