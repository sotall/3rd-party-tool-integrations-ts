FROM nwea/swarm-agent:node16

ARG NODE_VERSION=16.15.1
ARG YARN_VERSION=1.22.10

USER root

# Make sure we have the most up to date certs
RUN apt-get update; apt-get install -y ca-certificates;

# Install Dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends \
    zip \
    unzip \
    wget \
    vim \
    && apt-get clean

RUN curl -fSLO --compressed "https://nodejs.org/dist/v$NODE_VERSION/node-v$NODE_VERSION-linux-x64.tar.xz" \
    && tar -xf node-v$NODE_VERSION-linux-x64.tar.xz -C /opt/ \
    && ln -s /opt/node-v$NODE_VERSION-linux-x64/bin/node /usr/local/bin/node \
    && ln -s /opt/node-v$NODE_VERSION-linux-x64/bin/npm /usr/local/bin/npm \
    && node -v \
    && npm -v \
    && npm install --global yarn@$YARN_VERSION \
    && ln -snf /opt/node-v$NODE_VERSION-linux-x64/bin/yarn /usr/local/bin/yarn \
    && ln -snf /opt/node-v$NODE_VERSION-linux-x64/bin/yarnpkg /usr/local/bin/yarnpkg \
    && yarn -v \

USER nwea

RUN git config --global user.email "scm.install@nwea.org" \
    && git config --global user.name "jenkins"

ENTRYPOINT [""]