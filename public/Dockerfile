FROM node:boron

ARG GIT_REPO

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
RUN git clone $GIT_REPO
RUN npm install

CMD [ "npm", "run", "test" ]


# usage example :
# docker build . --build-arg GIT_REPO=https://github.com/ruanyl/sort-it
# docker run XXX --rm -v ./output:./output

