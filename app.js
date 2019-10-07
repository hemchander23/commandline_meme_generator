#!/usr/bin/env node

const program = require('commander');
const Jimp = require('jimp');
const request = require('request');
const fs = require('fs');
const mime = require('mime');

program
  .command('create-meme <text>')
  .option('-i, --imagein [imagepath]', 'Base Image')
  .option('-o, --imageout [imagepath]', 'Output Image', 'output.jpg')
  .option('-s, --scale [number]', 'Provide a value from 0 to 1 to adjust the image scale', 1.0)
  .option('-p, --position [number]', 'Provide a value from 0 to 1 to adjust the image scale')
  .option('-a, --align [L,C,R]', 'Provide a alignment value. Default is center (C)', 'C')
  .action(function (text, cmd) {
    Jimp.read(cmd.imagein, (err, img) => {
      if (err) throw err;
      //Download image if its a public URL
      if (cmd.imagein) {
        let image_in = cmd.imagein;
        if (validateUrl(image_in)) {
          //Download the image
          download(image_in, 'image.png', function (mimety) {
            // console.log(mimety);
            if (['png', 'jpg', 'jpeg', 'tiff', 'gif', 'bmp'].contains(mimety)) {
              cmd.imagein = 'image.png';
            } else {
              throw "Unsupported image format !";
            }
          });
        }
      } else {
        throw "Cannot proceed without input image";
      }
      //Scale the image
      img.scale(parseFloat(cmd.scale));
      switch (cmd.align) {
        case 'L':
          align = 1
          break;
        case 'R':
          align = 4;
          break;
        case 'C':
        default:
          align = 2;
          break;
      }
      if (cmd.position) {
        let y_arr = String(cmd.position).split("|");
        let tx_arr = String(text).split("|");
        if (tx_arr.length > y_arr.length)
          console.error("More text to position. Make sure the number of text parts match the position blocks defined");
        y_arr.forEach(function (v, k) {
          writeTextToMeme(img, String(tx_arr[k]), parseInt(v), cmd, align);
        })
      } else {
        writeTextToMeme(img, text, 20, cmd, align);
      }
    });
  });

function writeTextToMeme(img, text, y, cmd, align) {
  Jimp.loadFont("./font/impact-yellow/72/font.fnt").then(font => {
    img.print(font, 10, y, {
      text: text,
      alignmentX: align
    }, img.bitmap.width - 50);
    img.write(cmd.imageout);
  });
}

function download(uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);
    const mimety = mime.getExtension(res.headers['content-type']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close',function(){
      callback(mimety);
    });
  });
};

function validateUrl(value) {
  return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
}

Array.prototype.contains = function(element){
  return this.indexOf(element) > -1;
};

program.parse(process.argv);
