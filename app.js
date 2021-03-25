const Jimp = require('jimp');
const inquirer = require('inquirer');
const fs = require('fs');

const addTextWatermarkToImage = async function(inputFile, outputFile, text) {
  try {
    const image = await Jimp.read(inputFile);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    const textData = {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    };
    
    image.print(font, 0, 0, textData, image.getWidth(), image.getHeight());
    await image.quality(100).writeAsync(outputFile);
  }
  catch(error) {
    console.log('Something went wrong... Try again!');
  }
};

//addTextWatermarkToImage('./test.jpg', './test-with-watermark.jpg', 'Hello world')

const addImageWatermarkToImage = async function(inputFile, outputFile, watermarkFile) {
  try {
    const image = await Jimp.read(inputFile);
    const watermark = await Jimp.read(watermarkFile);
    const x = image.getWidth() / 2 - watermark.getWidth() / 2;
    const y = image.getHeight() / 2 - watermark.getHeight() / 2;
    
    image.composite(watermark, x, y, {
      mode: Jimp.BLEND_SOURCE_OVER,
      opacitySource: 0.5,
    });
    await image.quality(100).writeAsync(outputFile);
  }
  catch(error) {
    console.log('Something went wrong... Try again!');
  }
};

const makeImageBrighter = async function(inputFile, outputFile) {
  try {
    const image = await Jimp.read(inputFile);
    image.color([{apply:'brighten', params: [50]}]);
    await image.quality(100).writeAsync(outputFile);
  }
  catch(error) {
    console.log('Something went wrong... Try again!');
  }
}

const imageContrastMode = async function(inputFile, outputFile) {
  try {
    const image = await Jimp.read(inputFile);
    image.contrast(.5)
    await image.quality(100).writeAsync(outputFile);
  }
  catch(error) {
    console.log('Something went wrong... Try again!');
  }
}

const makeImageFaded = async function(inputFile, outputFile) {
  try {
    const image = await Jimp.read(inputFile);
    image.color([{apply:'greyscale', params: [0]}])
    await image.quality(100).writeAsync(outputFile);
  }
  catch(error) {
    console.log('Something went wrong... Try again!');
  }
}

const invertImage = async function(inputFile, outputFile) {
  try {
    const image = await Jimp.read(inputFile);
    image.invert()
    await image.quality(100).writeAsync(outputFile);
  }
  catch(error) {
    console.log('Something went wrong... Try again!');
  }
}
  
//addImageWatermarkToImage('./test.jpg', './test-with-watermark2.jpg', './logo.png');
const prepareOutputFilename = (filename) => {
  const [ name, ext ] = filename.split('.');
  return `${name}-with-watermark.${ext}`;
};

const startApp = async () => {

  // Ask if user is ready
  const answer = await inquirer.prompt([{
    name: 'start',
    message: 'Hi! Welcome to "Watermark manager". Copy your image files to `/img` folder. Then you\'ll be able to use them in the app. Are you ready?',
    type: 'confirm'
  }]);

  // if answer is no, just quit the app
  if(!answer.start) process.exit();

  // ask about input file and watermark type
  const options = await inquirer.prompt([{
    name: 'inputImage',
    type: 'input',
    message: 'What file do you want to mark?',
    default: 'test.jpg',
  },{
    name: 'anotherActions',
    type: 'list',
    message: 'Do you want only waterMark or something more?',
    choices: ['Only waterMark', 'Something more'],
  }]);
  if(options.anotherActions === 'Only waterMark') { 
    const marked = await inquirer.prompt([{
      name: 'watermarkType',
      type: 'list',
      choices: ['Text watermark', 'Image watermark'],
    }]);
    if(marked.watermarkType === 'Text watermark') {
      const text = await inquirer.prompt([{
        name: 'value',
        type: 'input',
        message: 'Type your watermark text:',
      }]);
      marked.watermarkText = text.value;
      if (fs.existsSync(`./img/${options.inputImage}`)) {
        addTextWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), marked.watermarkText);
        console.log("Fantastic!");
        startApp();
      } else {
        console.log('Something went wrong... Try again');
      }
    } else {
      const image = await inquirer.prompt([{
        name: 'filename',
        type: 'input',
        message: 'Type your watermark name:',
        default: 'logo.png',
      }])
      marked.watermarkImage = image.filename;
      if (fs.existsSync(`./img/${options.inputImage}`) && fs.existsSync(`./img/${marked.watermarkImage}`)) {
        addImageWatermarkToImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage), marked.watermarkImage);
        console.log("Fantastic!");
        startApp();
      } else {
        console.log('Something went wrong... Try again');
      }
    }
  }
  if(options.anotherActions === 'Something more') {
    const actions = await inquirer.prompt([{
      name: 'actionType',
      type: 'list',
      choices: ['Brighten image', 'Increase contrast', 'Make image black & white', 'Invert image'],
    }]);
    if(actions.actionType === 'Brighten image') {
      if (fs.existsSync(`./img/${options.inputImage}`)) {
        makeImageBrighter('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage));
        console.log("Fantastic!");
        startApp();
      } else {
        console.log('Something went wrong... Try again');
      }
    } else if(actions.actionType === 'Increase contrast') {
      if (fs.existsSync(`./img/${options.inputImage}`)) {
        imageContrastMode('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage));
        console.log("Fantastic!");
        startApp();
      } else {
        console.log('Something went wrong... Try again');
      }
    } else if(actions.actionType === 'Make image black & white') {
      if (fs.existsSync(`./img/${options.inputImage}`)) {
        makeImageFaded('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage));
        console.log("Fantastic!");
        startApp();
      } else {
        console.log('Something went wrong... Try again');
      }
    } else {
      if (fs.existsSync(`./img/${options.inputImage}`)) {
        invertImage('./img/' + options.inputImage, './img/' + prepareOutputFilename(options.inputImage));
        console.log("Fantastic!");
        startApp();
      } else {
        console.log('Something went wrong... Try again');
      }
    }
  }
  
  
}

startApp();