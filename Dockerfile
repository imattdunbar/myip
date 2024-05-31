FROM golang:latest

WORKDIR /app

RUN apt-get update && apt-get install -y curl unzip && curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

COPY . .

RUN make build-prod

# -- How to use env variables from Railway in this custom Dockerfile --
# Specify the variable you need
# ARG RAILWAY_SERVICE_NAME
# Use the varible
# RUN echo $RAILWAY_SERVICE_NAME

EXPOSE $PORT

CMD ["./out"]