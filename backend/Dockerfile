FROM golang:latest

ENV DEBIAN_FRONTEND noninteractive

WORKDIR /go/projects/newclip

COPY . .

RUN go install

CMD /go/bin/newclip