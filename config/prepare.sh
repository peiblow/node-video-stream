#!/bin/bash
echo Hi, what is the name of the video?
read filename

echo And what is the extension of the video?
read fileextension

mkdir "./output"

ffmpeg \
  -i ./assets/$filename.$fileextension \
  -vcodec h264 \
  -acodec aac \
  -movflags frag_keyframe+empty_moov+default_base_moof \
  -b:v 1500k \
  -maxrate 1500k \
  -bufsize 1000k \
  -f mp4 \
  ./output/adapted_video.mp4
