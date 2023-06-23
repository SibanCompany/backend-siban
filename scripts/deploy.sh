docker pull sangwoong03/siban:${GITHUB_SHA::7}
docker run -d --name siban-api -p 8080:8080 sangwoong03/siban:${GITHUB_SHA::7}