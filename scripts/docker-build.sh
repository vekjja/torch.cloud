# docker login ghcr.io -u seemywingz -p $GITHUB_PAT

# Get the current git IMG_TAG
IMG_TAG=$([[ -z "$1" ]] && echo "local-build" || echo $1)

# --platform linux/amd64,linux/arm64 \
docker buildx build \
    --platform linux/arm64 \
    -t ghcr.io/seemywingz/torch.cloud:$IMG_TAG \
    --push .
