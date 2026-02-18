FROM php:8.2-cli

WORKDIR /var/www

# Installer extensions nécessaires
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    zip \
    && docker-php-ext-install pdo pdo_mysql

# Installer Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Copier le projet
COPY . .

# Installer dépendances
RUN composer install

# Exposer le port Symfony
EXPOSE 8000

# Lancer serveur Symfony
CMD php -S 0.0.0.0:8000 -t public
