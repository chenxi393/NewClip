FROM golang:alpine AS builder

LABEL stage=gobuilder

# 解决go镜像下载慢的问题
ENV GO111MODULE=on \
    GOPROXY=https://goproxy.cn,direct

WORKDIR /go/projects/newclip

COPY . .

RUN go install

FROM alpine

WORKDIR /app

COPY --from=builder /go/projects/newclip/config /app/config

COPY --from=builder /go/bin/newclip /app/newclip

CMD /app/newclip