FROM golang:latest

WORKDIR /src

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN go build -o /app && chmod u+x /app

EXPOSE 8080

ENTRYPOINT ["/app"]