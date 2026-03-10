FROM php:8.2-cli

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo pdo_mysql

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

COPY . .

COPY php.ini /usr/local/etc/php/conf.d/uploads.ini

RUN composer install

EXPOSE 8000

CMD php -S 0.0.0.0:8000 -t public