# syntax=docker/dockerfile:1





# NOTE:
# use this for Docker BuildKit when invoking Docker build on CLI:
# DOCKER_BUILDKIT=1 docker build .







# use the latest Node.js LTS, currently v16.
# but this is NOT for serious production just yet, it's still in development, so it will be fine.
FROM node:lts

# set NODE_ENV to use production:
ENV NODE_ENV=production

# set working directory inside container:
WORKDIR /usr/src/app

# add BOTH NPM package.json AND package-lock.json files to container:
COPY ["package*.json", "./"]

# NPM install packages:
RUN npm ci --production --only=production

# add project files to container:
COPY ["./dist*", "./public", "./views", "./"]
# if you want live file updates
#COPY . .
#VOLUME . .

# mock database initialization:
RUN npm run init-db

# run program in this project:
CMD [ "node", "dist-tsc/js/server/server.js" ]

# allow server port:
EXPOSE 8080

# At the end, set the user to use when running this image:
USER node