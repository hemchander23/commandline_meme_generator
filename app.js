const program = require('commander');
const Jimp = require('jimp');
program
  .command('create-meme <text>')
  .option('-i, --image [imagepath]', 'Base Image')
  .action(function (text, cmd) {
    console.log(text);
    console.log(cmd.image);
    
    Jimp.read(cmd.image, (err, duck) => {
      if (err) throw err;
      Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(font => {
        duck.print(font, 10, 10, text, 800);
        duck.write('duck_w.jpg'); // save
      });
    });
  });

program.parse(process.argv);
