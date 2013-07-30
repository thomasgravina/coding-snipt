#!/bin/bash
# Zip a folder and send it to Dropbox

FOLDER=""

if [ "$1" != "" ]; then
    FOLDER=$1
    echo "Saving folder $FOLDER"
    tar -cvf $FOLDER.tar $FOLDER/
    cp $FOLDER.tar ~/Dropbox/save_laptop/
else
    echo "Param missing."
fi

