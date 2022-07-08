FROM ubuntu:latest

RUN apt update && apt install -y aspell

CMD aspell -d en dump master \
  | aspell -l en expand \
  | sed "s/\w*'//g;s/ \+/\n/g" \
  | mawk '{ print tolower($0) }' \
  | uniq \
  | sort \
  | grep -x '.\{5,5\}'
