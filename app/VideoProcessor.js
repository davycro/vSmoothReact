const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawn } = require('child_process');


class VideoProcessor {

  constructor(sourceFile) {
    this.sourceFile = sourceFile.path;
    this.workDir = fs.mkdtempSync(path.join(os.tmpdir(), 'vsmooth-'));
    this.videoDuration = null;
  }

  async build(options) {

    const inFile = this.sourceFile;
    const transformFile = path.join(this.workDir, 'transform.trf');
    const vidstabdetectFile = path.join(this.workDir, 'transform.mp4');
    const outFile = path.join(this.workDir, 'stable.mp4');

    const {
      shakiness = 5,
      accuracy = 15,
      smoothing = 10,
      maxshift = -1,
      maxangle = -1,
      crop = "keep",
      optalgo = "gauss",
      tripod = 0
    } = options;

    const vidstabdetectArgs = [
      '-i', inFile,
      '-vf', `vidstabdetect=shakiness=${shakiness}:accuracy=${accuracy}:tripod=${tripod}:result=${transformFile}`,
      vidstabdetectFile
    ]

    const vidstabtransformArgs = [
      '-i', vidstabdetectFile,
      '-vf', `vidstabtransform=input=${transformFile}:optalgo=${optalgo}:smoothing=${smoothing}:crop=${crop}:maxangle=${maxangle}:maxshift=${maxshift}:tripod=${tripod}`,
      outFile
    ]

    options.onProgressLabel = 'Stabilizing video (step 1 of 2)';
    await this._run(vidstabdetectArgs, options);

    options.onProgressLabel = 'Transform video (step 2 of 2)';
    await this._run(vidstabtransformArgs, options);

    options.onComplete({finalFile: outFile});
  }

  _run(args, options) {
    const binFile = './bin/ffmpeg';
    const {onProgress, onProgressLabel} = options;

    const convertTimeStringToMilliSeconds = (a, b, c) => {
      // time(HH:MM:SS.mss)
      return (
        (c = 0),
        (a = a.split(".")),
        !a[1] || (c += a[1] * 1),
        (a = a[0].split(":")),
        (b = a.length),
        (c +=
          (b == 3
            ? a[0] * 3600 + a[1] * 60 + a[2] * 1
            : b == 2
            ? a[0] * 60 + a[1] * 1
            : (s = a[0] * 1)) * 1e3),
        c
      );
    };

    console.log(`Running: ${binFile} ${args.join(' ')}`);

    return new Promise(
      (resolve, reject) => {

        const ffmpeg = spawn(binFile, args);

        // logging parameters
        let vidDuration = null;
        let currentTime = 0;
        let logData = [];
        ffmpeg.stderr.on('data', (data) => {
          const dataStr = Buffer.from(data).toString('utf8');
          logData.push(dataStr);

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
          if (code==1) {
            console.log(`Error! ${logData.join(' ')}`);
          }
          resolve();
        });
      }
    )
  }

}


module.exports = VideoProcessor;
