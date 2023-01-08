FROM  node:18.12.1-bullseye
# ENV NODE_ENV=production
WORKDIR /app
COPY . .
RUN npm install
# RUN npm run build
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
