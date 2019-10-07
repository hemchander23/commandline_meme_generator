#!/usr/bin/env node

const program = require('commander');
const Jimp = require('jimp');

program
  .command('create-meme <text>')
  .option('-i, --imagein [imagepath]', 'Base Image')
  .option('-o, --imageout [imagepath]', 'Output Image')
  .option('-s, --scale [number]', 'Provide a value from 0 to 1 to adjust the image scale', 1.0)
  .option('-p, --position [number]', 'Provide a value from 0 to 1 to adjust the image scale')
  .option('-a, --align [L,C,R]', 'Provide a alignment value. Default is center (C)')
  .action(function (text, cmd) {
    Jimp.read(cmd.imagein, (err, img) => {
      if (err) throw err;
      img.scale(parseFloat(cmd.scale));
      switch(cmd.align){
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
      if(cmd.position){
        let y_arr = String(cmd.position).split("|");
        let tx_arr = String(text).split("|");
        if(tx_arr.length > y_arr.length)
          console.error("More text to position. Make sure the number of text parts match the position blocks defined");
        y_arr.forEach(function(v,k){
          writeTextToMeme(img,String(tx_arr[k]),parseInt(v),cmd,align);
        })
      }else{
        writeTextToMeme(img,text,20,cmd,align);
      }
    });
  });

  function writeTextToMeme(img,text,y,cmd,align){
    Jimp.loadFont("./font/impact-yellow/72/font.fnt").then(font => {
      img.print(font, 10, y, {
        text: text,
        alignmentX: align
      }, img.bitmap.width - 50);
      img.write(cmd.imageout);
    });
  }

program.parse(process.argv);
