const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require('child_process');

class VideoProcessor {

  constructor(sourceFile) {
    this.binFile = './bin/ffmpeg';
    this.sourceFile = sourceFile.path;

    this.videoDuration = null;

    this.workDir = null;
    this.transformFile = null;
    this.vidstabdetectFile = null;
    this.finalFile = null;
  }

  async build(options) {
    await this._makeWorkDir();
    await this._vidstabdetect(options);
    await this._vidstabtransform(options);

    options.onComplete({finalFile: this.finalFile});
  }

  _makeWorkDir() {
    return new Promise(
      (resolve, reject) => {
        if (this.workDir) resolve();
        fs.mkdtemp(path.join(os.tmpdir(), 'vsmooth-'), (err, folder) => {
          if (err) throw err;

          this.workDir = folder;
          this.transformFile = path.join(this.workDir, 'transform.trf');
          this.vidstabdetectFile = path.join(this.workDir, 'out.mp4');
          this.finalFile = path.join(this.workDir, 'stable.mp4');

          resolve();
        });
      }
    )
  }

  _run(args, options) {
    const binFile = './bin/ffmpeg';
    const {onProgress, onProgressLabel} = options;

    const convertTimeStringToMilliSeconds = (a,b,c) => { // time(HH:MM:SS.mss)
      return c = 0,
        a = a.split('.'), !a[1] || (c += a[1] * 1),
        a = a[0].split(':'), b = a.length,
        c += (b == 3 ? a[0] * 3600 + a[1] * 60 + a[2] * 1 : b == 2 ? a[0] * 60 + a[1] * 1 : s = a[0] * 1) * 1e3,
        c
    }

    console.log(`Running: ${binFile} ${args.join(' ')}`);

    return new Promise(
      (resolve, reject) => {

        const ffmpeg = spawn(binFile, args);

        // logging parameters
        let vidDuration = null;
        let currentTime = 0;

        ffmpeg.stderr.on('data', (data) => {
          const dataStr = Buffer.from(data).toString('utf8');

          if (!vidDuration) {
            const matches = dataStr.match(/Duration:(.*), start:/);
            if (matches) vidDuration = convertTimeStringToMilliSeconds(matches[1])

          } else {
            const matches = dataStr.match(/time=(.*) bitrate/);
            if (matches) {
              currentTime = convertTimeStringToMilliSeconds(matches[1]);
              if (currentTime>vidDuration) currentTime=vidDuration;

              onProgress({
                label: onProgressLabel,
                currentTime: currentTime,
                totalTime: vidDuration
              });
            }
          }
        });

        ffmpeg.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
          resolve();
        });
      }
    )
  }

  _vidstabdetect(options) {
    const {onProgress} = options
    const args = [
      '-i', this.sourceFile,
      '-vf', `vidstabdetect=shakiness=10:accuracy=15:result=${this.transformFile}`,
      this.vidstabdetectFile
    ]
    options.onProgressLabel = 'Stabilizing video (step 1 of 2)';

    return this._run(args, options);
  }

  _vidstabtransform(options) {
    const inFile = this.vidstabdetectFile;
    const transformFile = this.transformFile;
    const outFile = this.finalFile;

    const binFile = this.binFile;
    const args = [
      '-i', inFile,
      '-vf', `vidstabtransform=input=${transformFile}:optalgo=gauss:smoothing=10:crop=keep`,
      outFile
    ]
    options.onProgressLabel = 'Transform video (step 2 of 2)';

    return this._run(args, options);
  }

}


module.exports = VideoProcessor;
