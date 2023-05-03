import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';

import { spawn } from 'node:child_process';

createServer(async (req, res) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*'
  };

  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }

  res.writeHead(200, {
    'Content-Type': 'video/mp4'
  })

  const ffmpegProcess = spawn('ffmpeg', [
    '-i', 'pipe:0',
    '-f', 'mp4',
    '-vcodec', 'h264',
    '-acodec', 'aac',
    '-movflags', 'frag_keyframe+empty_moov+default_base_moof',
    '-b:v', '1500k',
    '-maxrate', '1500k',
    '-bufsize', '1000k',
    '-f', 'mp4',
    '-vf', "drawtext=fontfile= /Windows/fonts/calibri.ttf:x=10:y=H-th-680:fontsize=25:fontcolor=yellow:shadowcolor=black:shadowx=5:shadowy=5:text=Pablo Fernandes",
    'pipe:1'
  ], {
    stdio: ['pipe', 'pipe', 'pipe']
  })

  createReadStream('./output/adapted_video.mp4').pipe(ffmpegProcess.stdin);
  ffmpegProcess.stdout.pipe(res)
  ffmpegProcess.stderr.on('data', msg => console.log(msg.toString()))

  req.once('close', () => {
    ffmpegProcess.stdout.destroy()
    ffmpegProcess.stdin.destroy()
    console.log('disconnected!', ffmpegProcess.kill())
  })
}).listen(3000, () => console.log('Server is running on 3000;'))