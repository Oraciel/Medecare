#!/bin/bash

until docker exec mariadb mysqladmin ping --silent; do
    echo 'Waiting for the MariaDB server to start...'
    sleep 1
done

# Execute the SQL script
docker exec -i medecare-mariadb-1 mariadb -uroot -pam001541 medecare < /docker-entrypoint-initdb.d/update.sql

echo 'SQL script executed successfully.'
