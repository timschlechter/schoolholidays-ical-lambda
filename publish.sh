mkdir -p ./build

cd src
rm -f ../build/package.zip
zip -r ../build/package.zip .

aws lambda update-function-code \
    --region eu-west-1 \
    --function-name getSchoolholidaysICal  \
    --zip-file fileb://../build/package.zip \
    --profile default