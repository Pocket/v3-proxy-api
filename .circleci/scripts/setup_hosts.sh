#!/bin/bash
set -e

echo "Adding service hosts records"

for i in "${arr[@]}"; do
    echo 127.0.0.1 "$i" | sudo tee -a /etc/hosts
done
