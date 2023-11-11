FROM node:18

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

ENV NODE_ENV=production
ENV PORT=3000
ENV SESSION_SECRET=secret_session_key
ENV MONGO_URL=
ENV STRIPE_KEY=
ENV STRIPE_SECRET=
ENV SENDGRID_API_KEY=
ENV SENDGRID_VALIDATED_SENDER=

EXPOSE 3000

CMD [ "npm", "start" ]