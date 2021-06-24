FROM bitnami/node:14 as builder

# Set working directory
WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm ci

COPY . .

# Run typescript compiler
RUN npm run build

# Remove node modules folder to prevent caching
RUN rm -rf node_modules

# Install only production dependencies
RUN npm ci --only=production && npm cache verify


################################### WIP: Container optimization

# --------------> The production image
# FROM bitnami/node:14-prod as production
FROM node:14.17.1-alpine as production
# Set node environment
ENV NODE_ENV=production

# Set non root user
USER node

# Set working directory
WORKDIR /app

# Add package.json to WORKDIR
COPY package*.json ./

# Application port
EXPOSE 3000

# EXPOSE 9229
COPY --from=builder --chown=node:node ./app/dist ./dist
COPY --from=builder --chown=node:node ./app/node_modules ./node_modules

CMD ["npm", "start"]
