#!/bin/bash -ex

FILE_NAME=$(basename "$0")
STAGE="${FILE_NAME%.*}"

ansible-playbook config/ansible/playbook.yml -vv \
    -e patch_release_version=${BUILD_ID} \
    -e build_id=${BUILD_ID} \
    -e workspace=${WORKSPACE} \
    -e jenkin_home=$JENKINS_HOME
