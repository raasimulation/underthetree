let img;
let noteSequence = ["C1", "D4", "F3", "G3", "D3"];
let currentNote = 0;
let shadow;
let cells = 100;
let subtitles = [
  "The mulberry tree says things I cannot understand, She says stay and wait",
  "The mulberry tree says things I cannot understand, He says don’t sit under the tree",
  "The mulberry tree says things I cannot understand, She says go and come backkkkkkk",
  "The mulberry tree says things I cannot feel, She says come back and never go please",
  "The mulberry tree shows me things,I cannot see. He says it’s beautiful can’t you see?",
  "The mulberry tree sits at the sea,where I cannot go. She makes rocks for people to sit",
  "The mulberry tree is sweet,the taste I cannot feel. She leaves her fruits on the ground",
  "The mulberry tree is quiet,the sound I cannot hear. She hears me complain about this thing",
  "The mulberry tree is quiet,the sound I cannot hear. She hears me complain about this",
  "The mulberry tree is quiet,the sound I cannot hear. She hears me",
];
let currentSubtitle = 0;
let startTime;

let questions = [
  "where did you grow up?",
  "are you eating a pear rn?",
  "pears or mulberries?",
];
let osc, polySynth, playing, freq, amp;
let inputs = [];
let currentQuestion = 0;
let resultText = "";
let centerX, centerY;
let arcRadius = 200;
let angleIncrement;
let soundFile;
let showQuestion = false;
let typingText =
  "do you even like mulberry? it's like this gooey thing that people eat...but idk why it's still sweet and it's taking so much space everywhere.. :d i wish it didn't though, our old house at narimanov station had so much of these that i kinda took them for granted as time went on, but i do not miss the texture at all...what about you does your sense allow you to like the mulberry tree or are you playing under the leaves of a fig tree somewhere with a tree tongue and a stem heart....xd ";
let typedText = "";
let typingSpeed = 10;
let font;

let sighButton;
let isTypingComplete = false;

function preload() {
  soundFormats("mp3", "ogg");
  soundFile = loadSound("clank.mp3");
  img = loadImage("mulberry-tree.png");
  font = loadFont('Myungjo.otf');
}

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight);
  centerX = width / 2;
  centerY = height / 4;
  background(0);
  angleIncrement = PI / (questions.length + 1);
  startTime = millis();
  img.resize(width, height);
  noStroke();
  cnv.mouseMoved(playSynth);
  osc = new p5.Oscillator("sawtooth");
  polySynth = new p5.PolySynth();
  p5.soundOut.bufferSize = 1024; // buffer size as needed
  p5.soundOut.samplerate = 44100;

  for (let i = 0; i < questions.length; i++) {
    inputs.push(createInput());
    inputs[i].changed(handleInput);
    inputs[i].style("position", "absolute");
    inputs[i].style("display", "none");
  }

  sighButton = createButton('sigh');
  sighButton.hide();
  sighButton.position(width / 4, height / 3 + 50);
  sighButton.mousePressed(goToIndex3);
  sighButton.style('background-color', 'white');
  sighButton.style('border', 'none');
}

function displayCurrentSubtitle(text) {
  fill(255);
  textAlign(LEFT, TOP);
  textSize(36);
  textFont("Adobe Myungjo Std");
  stroke(0);
  strokeWeight(7);
  window.text(text, width / 3, height / 2, 500, 200);
}

function displayTypedText() {
  textAlign(CENTER, CENTER);
  textSize(26);
  stroke(0);
  strokeWeight(5);
  fill(255);
  text(typedText, width / 6, height / 3, 600, 500);
}

function draw() {
  if (resultText !== "") {
    clear();
    resultText = "";
    inputs.forEach((input) => input.remove());
    subtitles = [];
    currentSubtitle = 0;
    currentQuestion = 0;
    showQuestion = false;
    typedText = "";
  } else {
    // Render the pixelated mulberry PNG and subtitles
    cells = map(mouseX, 0, width, 10, 80);
    cells = ceil(cells / 10) * 4;
    noStroke();

    for (let y = 0; y < img.height; y += cells) {
      for (let x = 0; x < img.width; x += cells) {
        fill(img.get(x, y));
        rect(x, y, cells, cells);
      }
    }

    if (currentSubtitle < subtitles.length) {
      let currentVaxt = millis() - startTime;

      if (currentVaxt < 4000) {
        displayCurrentSubtitle(subtitles[currentSubtitle]);
      } else {
        currentSubtitle++;
        startTime = millis();
        // Set showQuestion to true after all subtitles are shown
        if (currentSubtitle === subtitles.length) {
          showQuestion = true;
        }
      }
    }

    // Display current question and input only after all subtitles are shown
    if (showQuestion) {
      textAlign(CENTER, CENTER);
      textSize(32);
      fill(255);
      stroke(0);
      strokeWeight(2);
      push();
      translate(centerX, centerY);
      let angle = -PI / 2 + angleIncrement * (currentQuestion + 1);
      let x = arcRadius * cos(angle);
      let y = arcRadius * sin(angle);
      text(questions[currentQuestion], x - 80, y);
      inputs[currentQuestion].position(centerX + x - 20, centerY + y - 30);
      inputs[currentQuestion].style("display", "block"); // Show the current input
      pop();
    } else if (currentSubtitle === subtitles.length) {
      displayTypedText();

      // Check if typing is complete
      if (
        millis() - startTime > typingSpeed &&
        typedText.length < typingText.length
      ) {
        // Add one character at a time
        typedText += typingText.charAt(typedText.length);
        startTime = millis();
      }

      // Display the button only if typing is complete
      if (typedText.length >= typingText.length) {
        isTypingComplete = true;
      }

      // Display the button only if typing is complete
      if (isTypingComplete) {
        sighButton.show();
      }
    }
  }
}


function handleInput() {
  inputs[currentQuestion].style("display", "none");
  soundFile.play();

  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    inputs[currentQuestion].style("display", "block");
  } else {
    clear();
    background(8,39,245);
    inputs.forEach((input) => input.remove());
    subtitles = [];
    currentSubtitle = 0;
    currentQuestion = 0;
    showQuestion = false;
    typedText = "";
  }
}

function playSynth() {
    
  // note duration (in seconds)
  let dur = 0.2;

  // start time (in seconds)
  let startTime = 0;

  // velocity (volume, from 0 to 1)
  let vel = 0.8;

  polySynth.play(noteSequence[currentNote], vel, currentNote * 0.3, dur);

  // Increment the currentNote index for the next call
  currentNote = (currentNote + 1) % noteSequence.length;
}

function goToIndex3() {
  window.location.href = '../sea/index-3.html';
}
