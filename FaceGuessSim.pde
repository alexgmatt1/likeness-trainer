PImage[] a;
int[] correct, total;

final int n = 7;
final int[] fairFace = {100, 106, 242, 270, 354, 883, 1041, 1195, 1204, 1237, 1344, 1501, 1527, 1955};

int artist, drawing, image, fakeImage1, fakeImage2, face, eyebrows, mouthbrow, nose, eyes, mouth, hair;
int correctAnswer;

PrintWriter votes, accuracy;
boolean previousCorrect;

boolean biggerScreen;

void settings() {
  if (displayWidth < 1344 || displayHeight < 896) {
    size(672, 448);
    biggerScreen = false;
  } else {
    size(1344, 896);
    biggerScreen = true;
  }
}

void setup() {
  votes = createWriter("votes.txt");
  
  a = new PImage[4];
  correct = new int[n+1];
  total = new int[n+1];
  
  nextSelection();
}

void draw() {
  if (previousCorrect) {
    background(0, 255, 0);
  } else {
    background(255, 0, 0);
  }
  if (biggerScreen) {
    image(a[0], 448, 0, 448, 448);
    image(a[1], 0, 448, 448, 448);
    image(a[2], 448, 448, 448, 448);
    image(a[3], 896, 448, 448, 448);
  } else {
    image(a[0], 224, 0, 224, 224);
    image(a[1], 0, 224, 224, 224);
    image(a[2], 224, 224, 224, 224);
    image(a[3], 448, 224, 224, 224);
  }
}

void keyReleased() {
  switch(key) {
    case ',':
      answer(0);
      break;
    case '.':
      answer(1);
      break;
    case '/':
      answer(2);
      break;
    case ENTER:
      votes.flush();
      votes.close();
      accuracy = createWriter("accuracy.txt");
      for (int i = 0; i < 6; i++) {
        accuracy.println(i + "," + correct[i] + "," + total[i] + "," + float(correct[i])/total[i]);
      }
      accuracy.flush();
      accuracy.close();
      exit();
      break;
  }
}

void answer(int ans) {
  int sum = face + eyebrows + mouthbrow + nose + eyes + mouth + hair;
  total[sum]++;
  votes.println("D" + (artist+1) + "-" + (drawing+1) + "-" + (image+1) + "-" + 
  face + eyebrows + mouthbrow + nose + eyes + mouth + 
  hair + "," + (image+1) + "," + (fakeImage1+1) + "," + (fakeImage2+1) + "," + (ans == correctAnswer));
  if (ans == correctAnswer) {
    //println("Correct!");
    previousCorrect = true;
    correct[sum]++;
  } else {
    //println("Wrong");
    previousCorrect = false;
  }
  nextSelection();
}

void nextSelection() {
  artist = int(random(4));
  drawing = int(random(3));
  image = int(random(14));
  fakeImage1 = int(random(13));
  fakeImage1 += (fakeImage1>=image)?1:0;
  fakeImage2 = int(random(12));
  if (image < fakeImage1) {
    fakeImage2 += (fakeImage2>=image)?1:0;
    fakeImage2 += (fakeImage2>=fakeImage1)?1:0;
  } else {
    fakeImage2 += (fakeImage2>=fakeImage1)?1:0;
    fakeImage2 += (fakeImage2>=image)?1:0;
  }
  for (; face+eyebrows+nose+eyes+mouth+hair != 1;) {
    face = int(random(2));
    eyebrows = int(random(2));
    nose = int(random(2));
    eyes = int(random(2));
    mouth = int(random(2));
    hair = int(random(2));
  }
  
  a[0] = loadImage(dataPath(n + " Categories/Artist" + (artist+1) + "/Drawing" + (drawing+1) + "/D" + (artist+1) + "-" + (drawing+1) + "-" + fairFace[image] + "-" + face + eyebrows + nose + eyes + mouth + hair + ".png"));
  float r = random(6);
  if (r < 1) {
    a[1] = loadImage(dataPath("Images/" + fairFace[image] + ".jpg"));
    a[2] = loadImage(dataPath("Images/" + fairFace[fakeImage1] + ".jpg"));
    a[3] = loadImage(dataPath("Images/" + fairFace[fakeImage2] + ".jpg"));
    correctAnswer = 0;
  } else if (r < 2) {
    a[1] = loadImage(dataPath("Images/" + fairFace[image] + ".jpg"));
    a[2] = loadImage(dataPath("Images/" + fairFace[fakeImage2] + ".jpg"));
    a[3] = loadImage(dataPath("Images/" + fairFace[fakeImage1] + ".jpg"));
    correctAnswer = 0;
  } else if (r < 3) {
    a[1] = loadImage(dataPath("Images/" + fairFace[fakeImage1] + ".jpg"));
    a[2] = loadImage(dataPath("Images/" + fairFace[image] + ".jpg"));
    a[3] = loadImage(dataPath("Images/" + fairFace[fakeImage2] + ".jpg"));
    correctAnswer = 1;
  } else if (r < 4) {
    a[1] = loadImage(dataPath("Images/" + fairFace[fakeImage2] + ".jpg"));
    a[2] = loadImage(dataPath("Images/" + fairFace[image] + ".jpg"));
    a[3] = loadImage(dataPath("Images/" + fairFace[fakeImage1] + ".jpg"));
    correctAnswer = 1;
  } else if (r < 5) {
    a[1] = loadImage(dataPath("Images/" + fairFace[fakeImage1] + ".jpg"));
    a[2] = loadImage(dataPath("Images/" + fairFace[fakeImage2] + ".jpg"));
    a[3] = loadImage(dataPath("Images/" + fairFace[image] + ".jpg"));
    correctAnswer = 2;
  } else {
    a[1] = loadImage(dataPath("Images/" + fairFace[fakeImage2] + ".jpg"));
    a[2] = loadImage(dataPath("Images/" + fairFace[fakeImage1] + ".jpg"));
    a[3] = loadImage(dataPath("Images/" + fairFace[image] + ".jpg"));
    correctAnswer = 2;
  }
}
