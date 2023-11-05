FROM golang:latest

ENV DEBIAN_FRONTEND noninteractive

# 解决go镜像下载慢的问题
ENV GO111MODULE=on \
    GOPROXY=https://goproxy.cn,direct

WORKDIR /go/projects/newclip

COPY . .

RUN go install

CMD /go/bin/newclip