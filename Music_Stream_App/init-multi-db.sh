#!/bin/bash
set -e

# Function to create DB if it doesn't exist
function create_db_if_not_exists {
  db_name=$1
  db_exists=$(psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname = '$db_name'")
  if [ "$db_exists" != "1" ]; then
    echo "Creating database: $db_name"
    createdb -U postgres "$db_name"
  else
    echo "Database $db_name already exists"
  fi
}

create_db_if_not_exists "userdb"
create_db_if_not_exists "catalogdb"
create_db_if_not_exists "playbackdb"