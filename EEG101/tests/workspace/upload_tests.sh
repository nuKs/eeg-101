#!/bin/bash

aws devicefarm create-upload –-project-arn arn:Flux -–name test_bundle.zip –-type APPIUM_PYTHON_TEST_PACKAGE | jq :wq



