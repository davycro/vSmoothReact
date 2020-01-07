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
    this.onProgress = options.onProgress;
    await this._makeWorkDir();
    await this._vidstabdetect();
    await this._vidstabtransform();

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

  _vidstabdetect() {
    const inFile = this.sourceFile;
    const transformFile = this.transformFile;
    const outFile = this.vidstabdetectFile;

    const binFile = this.binFile;
    const args = [
      '-i', inFile,
      '-vf', `vidstabdetect=shakiness=10:accuracy=15:result=${transformFile}`,
      outFile
    ]

    return new Promise(
      (resolve, reject) => {

        // logging parameters
        let vidDuration = null;
        let currentTime = 0;

        const ffmpeg = spawn(binFile, args);

        ffmpeg.stderr.on('data', (data) => {

          const dataStr = Buffer.from(data).toString('utf8');

          if (!vidDuration) {
            const matches = dataStr.match(/Duration:(.*), start:/);
            if (matches) {
              vidDuration = this._timeString2ms(matches[1]);
            }
          } else {
            const matches = dataStr.match(/time=(.*) bitrate/);
            if (matches) {
              currentTime = this._timeString2ms(matches[1]);
              if (currentTime>vidDuration) currentTime=vidDuration;
              this.onProgress({
                step: "Building Transform",
                currentTime: currentTime,
                totalTime: vidDuration
              });
            }
          }

          let percentDone = (currentTime / vidDuration) * 100.0;
          if (!isNaN(percentDone)) {
            if (percentDone>100.00) percentDone = 100.00;
            console.log(`PercentText: ${percentDone.toFixed(2)}`);
          }

        });

        ffmpeg.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
          console.log(outFile);
          resolve(outFile);
        });
      }
    )
  }

  _vidstabtransform() {
    const inFile = this.vidstabdetectFile;
    const transformFile = this.transformFile;
    const outFile = this.finalFile;

    const binFile = this.binFile;
    const args = [
      '-i', inFile,
      '-vf', `vidstabtransform=input=${transformFile}:optalgo=gauss:smoothing=10:crop=keep`,
      outFile
    ]

    return new Promise(
      (resolve, reject) => {

        // logging parameters
        let vidDuration = null;
        let currentTime = 0;

        const ffmpeg = spawn(binFile, args);

        ffmpeg.stderr.on('data', (data) => {

          const dataStr = Buffer.from(data).toString('utf8');

          if (!vidDuration) {
            const matches = dataStr.match(/Duration:(.*), start:/);
            if (matches) {
              vidDuration = this._timeString2ms(matches[1]);
              console.log(`Duration: ${vidDuration}`);
            }
          } else {
            const matches = dataStr.match(/time=(.*) bitrate/);
            if (matches) {
              currentTime = this._timeString2ms(matches[1]);
              if (currentTime>vidDuration) currentTime=vidDuration;
              this.onProgress({
                step: "Building Movie",
                currentTime: currentTime,
                totalTime: vidDuration
              });
            }
          }

          let percentDone = (currentTime / vidDuration) * 100.0;
          if (!isNaN(percentDone)) {
            if (percentDone>100.00) percentDone = 100.00;
            console.log(`PercentText: ${percentDone.toFixed(2)}`);
          }

        });

        ffmpeg.on('close', (code) => {
          console.log(`child process exited with code ${code}`);
          resolve(outFile);
        });
      }
    )
  }

  _timeString2ms(a, b, c) { // time(HH:MM:SS.mss)
      return c = 0,
          a = a.split('.'), !a[1] || (c += a[1] * 1),
          a = a[0].split(':'), b = a.length,
          c += (b == 3 ? a[0] * 3600 + a[1] * 60 + a[2] * 1 : b == 2 ? a[0] * 60 + a[1] * 1 : s = a[0] * 1) * 1e3,
          c
  }

}


module.exports = VideoProcessor;
