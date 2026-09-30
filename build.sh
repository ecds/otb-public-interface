set -e

# NODE_ENV=$([ "$BRANCH" == "main" ] && echo $PROD_RESTART_COMMAND || echo $DEV_RESTART_COMMAND)

echo "Building image"

docker build \
       --platform linux/amd64 \
       --build-arg VITE_GOOGLE_MAPS_API_KEY=AIzaSyD-G_lDtvChv-P3nchtQYHoCLfFzn9ylr8 \
       -t otb_public_ui \
       --no-cache \
       .

echo "Logging in to AWS"
aws ecr get-login-password --region us-east-1 |
       docker login --username AWS --password-stdin *****.dkr.ecr.us-east-1.amazonaws.com
echo "Logged in successfully"

echo "Tagging image with latest"
docker tag otb_public_ui *****.dkr.ecr.us-east-1.amazonaws.com/otb_public_ui:latest

echo "Pushing image"
docker push *****.dkr.ecr.us-east-1.amazonaws.com/otb_public_ui:latest

echo "Force update service"
aws ecs update-service --cluster otb-pub-dev --service otb-pub-dev --force-new-deployment --region us-east-1