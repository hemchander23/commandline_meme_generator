const program = require('commander');
const Jimp = require('jimp');

program
  .command('create-meme <text>')
  .option('-i, --image [imagepath]', 'Base Image')
  .action(function (text, cmd) {
    // console.log(text);
    // console.log(cmd.image);
    Jimp.read(cmd.image, (err, img) => {
      if (err) throw err;
      img.resize(Jimp.AUTO,750);
      Jimp.loadFont("./font/impact-yellow/72/font.fnt").then(font => {
        img.print(font, 10, 10, {
          text: text, 
          alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
        }, img.bitmap.width - 10);
        img.write('duck_w.jpg'); // save
      });
    });
  });

program.parse(process.argv);
