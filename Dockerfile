ARG ALPINE_VERSION=3.21

FROM alpine:${ALPINE_VERSION} AS production

WORKDIR /var/www/html

# copy node app code
COPY src/ .

# copy supervisord config
COPY etc/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN apk update && apk add --no-cache \
        # base dependencies
        supervisor bash curl \
        # node dependencies
        nodejs pnpm \
        # libreoffice dependencies
        py3-pip libreoffice \
        # font dependencies
        msttcorefonts-installer fontconfig && \
        update-ms-fonts && \
        # install unoserver
        pip install --break-system-packages -U unoserver && \
        # create non root user
        addgroup -S unoapp && adduser -S unoapp -G unoapp  && \
        # configure supervisord
        chown -R unoapp:unoapp /run && \
        # install node dependencies
        pnpm install && \
        # clear cache
        rm -rf /var/cache/apk/* /tmp/*

USER unoapp

EXPOSE 3000

CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
