#!/bin/bash

# Update Homebrew
brew update

# Remove old versions of Docker and Docker Compose (if installed via Homebrew)
brew uninstall docker docker-compose

# Install Docker Desktop
brew install --cask docker

# Start Docker Desktop
open /Applications/Docker.app

# Wait for Docker to start
echo "Waiting for Docker to start..."
while ! docker system info > /dev/null 2>&1; do
  sleep 1
done
echo "Docker is ready."

# Install jq for parsing JSON in the next step
brew install jq

# Remove old Docker Compose version (if installed separately)
sudo rm /usr/local/bin/docker-compose

# Install Docker Compose
DOCKER_COMPOSE_VERSION=$(curl -s https://api.github.com/repos/docker/compose/releases/latest | jq -r .tag_name)

sudo curl -L "https://github.com/docker/compose/releases/download/$DOCKER_COMPOSE_VERSION/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version

echo "Docker and Docker Compose have been updated to the latest versions."
