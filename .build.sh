#!/bin/bash
cd "${0%/*}"
OUTPUT="${1:-spl2modules.spl}"
yarn install --non-interactive
yarn run build
chmod -R u=rwX,go= stage/*
chmod -R u-x+X stage/*
#chmod -R u=rwx,go= stage/bin/*
mv stage spl2modules
#python3 -m pip install --upgrade -t spl2modules/lib -r spl2modules/lib/requirements.txt --no-dependencies
#rm -rf spl2modules/lib/splunklib/__pycache__
#rm -rf spl2modules/lib/splunklib/searchcommands/__pycache__
#rm -rf spl2modules/lib/splunklib/modularinput/__pycache__
#rm -rf spl2modules/lib/*/__pycache__
tar -cpzf $OUTPUT --exclude=spl2modules/.* --overwrite spl2modules 
rm -rf spl2modules