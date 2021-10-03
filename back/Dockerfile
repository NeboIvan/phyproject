FROM golang:latest AS builder

WORKDIR /src

COPY go.mod ./
COPY go.sum ./
RUN go mod download

COPY . .

RUN go build -o /app && chmod u+x /app

#FROM scratch

#WORKDIR /

#COPY --from=builder /app /app

EXPOSE 8080

ENTRYPOINT ["/app"]