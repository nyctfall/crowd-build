# syntax=docker/dockerfile:1
#
#######################################################
# NOTE:
# use this for Docker BuildKit when invoking Docker build on CLI:
# DOCKER_BUILDKIT=1 docker build .
#######################################################
#
# Use Alpine Linux in prod if possible: 18-alpine, 18-alpine3.17, 18.14-alpine, 18.14-alpine3.17, 18.14.0-alpine, 18.14.0-alpine3.17, hydrogen-alpine, hydrogen-alpine3.17, lts-alpine, lts-alpine3.17
#
# Use Debian Linux if glibc is needed: 18, 18-bullseye, 18.14, 18.14-bullseye, 18.14.0, 18.14.0-bullseye, hydrogen, hydrogen-bullseye, lts, lts-bullseye, lts-hydrogen
#
#################################
## NOTE: this is NOT for serious production just yet, it's still in development, so it will be fine.
#################################
#
# init basic stuff:
FROM node:18.14.0-alpine3.17 AS bare

# set working directory:
WORKDIR /home/node/app

# add PNPM:
RUN npm install -g pnpm

# make node owner of project files:
RUN chown -Rc node:node /home/node/app

# use the non-root user:
USER node

# set CI mode for PNPM:
ENV CI=true
################################################################################


# prep base for dev or prod:
FROM bare AS base

# add project files:
COPY --chown=node:node . .

# PNPM install prod and dev packages:
RUN pnpm install
################################################################################


# stage for testing dev:
FROM base AS dev

# start in dev:
CMD ["npm", "run dev"]

# expose node and vite ports
EXPOSE 8080
EXPOSE 5173
EXPOSE 4173
################################################################################


# prep for prod:
FROM base as dist

# set NODE_ENV for production:
ENV NODE_ENV=production

# compile TypeScript and build Vite bundle:
RUN npm run build

# remove dev deps:
RUN find . -name 'node_modules' -delete

# add only prod pkgs:
RUN pnpm -PC server i --no-shamefully-hoist --config.recursive-install=false && \
pnpm -PC types i --no-shamefully-hoist --config.recursive-install=false

# remove extra stuff:
RUN find .                \
! -path '*/node_modules*' \
! -name 'package.json'    \
! -path './dist/*'        \
! -path './dist'          \
! -path './dist-tsc'      \
! -path './types'         \
! -path './server'        \
! -path './views*'        \
! -name '*.env'           \
! \( \( -path './types/*' -o -path './types/dist*' \) \( -name '*.js' -o -type d \) \) \
! \( -path './dist-tsc/*' \( -name '*.js' -o -type d \) \) \
-delete && rm -rf web

# remove dev pkgs from PNPM store:
RUN pnpm store prune
RUN mv -fv dist-tsc/* server && rm -fr dist-tsc
################################################################################


# minimal prod build
FROM node:18.14.0-alpine3.17 as prod

# set working directory inside container:
WORKDIR /home/node/app

# run program in production:
ENV NODE_ENV=production

# set the user to use when running this image:
USER node

# add built dist to container:
COPY --from=dist --chown=node:node /home/node/app/ .

CMD [ "node", "server/server.js" ]

EXPOSE 8080
