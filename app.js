#!/usr/bin/env node

const program = require('commander');
const Jimp = require('jimp');
const request = require('request');
const fs = require('fs');
const mime = require('mime');

program
  .command('create-meme <text>', 'Create meme')
  .option('-i, --imagein [imagepath]', 'Input Image - provide path.Default is muppet image', "https://i.imgflip.com/2gnnjh.jpg")
  .option('-o, --imageout [imagepath]', 'Output Image - provide path', 'output.jpg')
  .option('-s, --scale [number]', 'Multiplier to adjust the zoom/scale. This is indirectly to adjust the size of meme text', 1.0)
  .option('-p, --position [number]', 'Provide values seperated by pipe symbol `|` to place the text at the respective Y-coordinate', 10)
  .option('-a, --align [L,C,R]', 'Provide a alignment value. Default is center (C)', 'C')
  .action(function (text, cmd) {
    if (cmd.imagein) {
      Jimp.read(cmd.imagein, (err, img) => {
        if (err) {
          console.error("An Error Occurred",err);
          return;
        }
        //Download image if its a public URL
        if (!cmd.imagein) {
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
    } else {
      console.error("Bad image path");
    }
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

Array.prototype.contains = function (element) {
  return this.indexOf(element) > -1;
};

program.parse(process.argv);

if (program.args.length === 0) {
  program.help();
}