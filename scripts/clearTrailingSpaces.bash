#!/bin/env bash

function ensureBinaryExists() {
	command -v "$1" >/dev/null 2>&1 || { echo >&2 "[\"$1\" is required to run, but \"$1\" was not found in \$PATH. Aborting...]"; exit 1; }
}

ensureBinaryExists sed

for i in "$@"; do
	if [ ! -f "$i" ]; then
		echo "Skipping \"$i\"!  --> \"$i\" does not exist or is not a regular file!"
		continue;
	fi

	echo "linting \"$i\" ..."
	sed -i 's/[\t ]\+$//' "$i"
done

echo 'done!'
