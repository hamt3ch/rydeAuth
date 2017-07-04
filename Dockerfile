FROM alpine:3.4

# File Author / Maintainer
LABEL authors=""

# Update & install required packages
RUN apk add --update nodejs bash git

# Install yarn
RUN npm install yarn -g

# Install app dependencies
COPY package.json /www/package.json
RUN cd /www; yarn install

# Copy app source
COPY . /www

# Set work directory to /www
WORKDIR /www

# set your port
ENV PORT 9999

# expose the port to outside world
EXPOSE  9999

# start command as per package.json
CMD ["npm", "start"]
