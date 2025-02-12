# Load environment variables from .env
export $(grep -v '^#' .env | xargs)

kubectl create secret docker-registry ghcr-secret \
  --docker-server=ghcr.io \
  --docker-username=seemywingz \
  --docker-password=$GITHUB_PAT \
  --docker-email=kevin.jayne@icloud.com

kubectl create secret generic nextauth-secret \
  --from-literal=secret=$NEXTAUTH_SECRET

kubectl create secret generic google-client-id \
  --from-literal=client-id=$GOOGLE_CLIENT_ID

kubectl create secret generic google-client-secret \
  --from-literal=client-secret=$GOOGLE_CLIENT_SECRET

kubectl create secret generic linkedin-client-id \
  --from-literal=client-id=$LINKEDIN_CLIENT_ID

kubectl create secret generic linkedin-client-secret \
  --from-literal=client-secret=$LINKEDIN_CLIENT_SECRET

kubectl create secret generic discord-client-id \
  --from-literal=client-id=$DISCORD_CLIENT_ID

kubectl create secret generic discord-client-secret \
  --from-literal=client-secret=$DISCORD_CLIENT_SECRET
