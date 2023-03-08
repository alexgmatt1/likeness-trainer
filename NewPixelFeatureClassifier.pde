/*
  each line corresponds to a point and has X1, Y1
  17 jawline (0-16)
  5 person's right eyebrow (17-21)
  5 person's left eyebrow (22-26)
  9 nose (27-35)
  6 person's right eye (36-41)
  6 person's left eye (42-47)
  20 mouth (48-67)
*/

final int imageWidth = 448;
final int imageHeight = 448;
final int numberOfCoordinates = 68;
final int numberOfCategories = 7;

final int[] fairFace = {100, 106, 242, 270, 354, 883, 1041, 1195, 1204, 1237, 1344, 1501, 1527, 1955};

String[] featureCoords;
PImage sketch, colourByCategory;
int[][] coords;

int[] pixelCategories;

PShape redCross;

int displayMode = 0;

PImage[] noFeatures;
PImage[][][][][][][] noFeatureCombos;
boolean[] showFeatures;

void setup() {
  size(448, 448);
  //frameRate(30);
  
  //color[][] noFeatureColours = loadNoFeatureColours();
  color[][][][][][][][] noFeatureComboColours = loadNoFeatureComboColours();
  //color[] colourByCategoryColours = expandCategoryColours(new color[] {
  //                            color(128, 128, 128),
  //                            color(255, 0, 0),
  //                            color(0, 255, 0),
  //                            color(0, 0, 255),
  //                            color(0, 255, 255),
  //                            color(255, 0, 255),
  //                            color(255, 255, 0)
  //                          });
  
  for (int image = 9; image <= 9; image++) {
    println("set image to " + image);
    coords = new int[numberOfCoordinates][2];
    featureCoords = loadStrings("Coords/" + fairFace[image] + ".txt");
    if (featureCoords.length != numberOfCoordinates) {
      println("wrong number of coords");
      throw new RuntimeException("image: " + image);
    } else {
      for (int i = 0; i < featureCoords.length; i++) {
        coords[i] = int(split(featureCoords[i]," "));
      }
      for (int i = 0; i < coords.length; i++) {
        for (int j = 0; j < coords[i].length; j++) {
          println(i, j, coords[i][j]);
        }
      }
      pixelCategories = calculatePixelCategories(coords);
      //printArray(pixelCategories);
      
      for (int artist = 4; artist <= 4; artist++) {
        println("set artist to " + artist);
        for (int drawing = 1; drawing <= 1; drawing++) {
          println("set drawing to " + drawing);
          String sketchFileName = /*"Artist" + artist + "/Drawing" + drawing + "/*/"D" + artist + "-" + drawing + "-" + fairFace[image] + "-111111.png";
          println(dataPath(sketchFileName));
          sketch = loadImage(dataPath(sketchFileName));
          image(sketch, 0, 0);
          //colourByCategory = newImage(pixelCategories, colourByCategoryColours);
          
          //noFeatures = new PImage[numberOfCategories];
          //for (int i = 0; i < numberOfCategories; i++) {
          //  noFeatures[i] = newImage(pixelCategories, noFeatureColours[i]);
          //}
          
          noFeatureCombos = new PImage[2][2][2][2][2][2][2];
          
          int jawline = 1;
          int rightEyebrow = 1;
          int leftEyebrow = 1;
          int nose = 1;
          int rightEye = 1;
          int leftEye = 1;
          int mouth = 1;
          //for (int jawline = 0; jawline < 2; jawline++) {
          //  for (int rightEyebrow = 0; rightEyebrow < 2; rightEyebrow++) {
          //    for (int leftEyebrow = 0; leftEyebrow < 2; leftEyebrow++) {
          //      for (int nose = 0; nose < 2; nose++) {
          //        for (int rightEye = 0; rightEye < 2; rightEye++) {
          //          for (int leftEye = 0; leftEye < 2; leftEye++) {
          //            for (int mouth = 0; mouth < 2; mouth++) {
                        noFeatureCombos[jawline][rightEyebrow][leftEyebrow][nose][rightEye][leftEye][mouth] = newImage(sketchFileName, pixelCategories, noFeatureComboColours[jawline][rightEyebrow][leftEyebrow][nose][rightEye][leftEye][mouth]);
                        noFeatureCombos[jawline][rightEyebrow][leftEyebrow][nose][rightEye][leftEye][mouth].save("7 Categories/" + split(sketchFileName,".")[0] + "-" + jawline + "" + rightEyebrow + "" + leftEyebrow + "" + nose + "" + rightEye + "" + leftEye + "" + mouth + ".png");
          //            }
          //          }
          //        }
          //      }
          //    }
          //  }
          //}
          
          int eyebrow = 1;
          int eye = 1;
          //for (int jawline = 0; jawline < 2; jawline++) {
          //  for (int eyebrow = 0; eyebrow < 2; eyebrow++) {
          //    for (int nose = 0; nose < 2; nose++) {
          //      for (int eye = 0; eye < 2; eye++) {
          //        for (int mouth = 0; mouth < 2; mouth++) {
                    noFeatureCombos[jawline][eyebrow][eyebrow][nose][eye][eye][mouth].save("5 Categories/" + split(sketchFileName,".")[0] + "-" + jawline + "" + eyebrow + "" + nose + "" + eye + "" + mouth + ".png");
          //        }
          //      }
          //    }
          //  }
          //}
        }
      }
    }
    
    showFeatures = new boolean[numberOfCategories];
    for (int i = 0; i < showFeatures.length; i++) {showFeatures[i] = true;}
    
    createRedCross();
  }
}
int done = 0;
void draw() {
  if (done == 0) {
    //if (
    //switch (displayMode) {
    //  case 0:
    //    image(sketch, 0, 0);
    //    break;
    //  case 1:
    //  case 2:
    //  case 3:
    //  case 4:
    //  case 5:
    //  case 6:
    //  case 7:
    //    image(noFeatures[displayMode-1], 0, 0);
    //    break;
    //  case 8:
    //    image(colourByCategory, 0, 0);
    //    break;
    //}
    image(noFeatureCombos[showFeatures[0]?1:0][showFeatures[1]?1:0][showFeatures[2]?1:0][showFeatures[3]?1:0][showFeatures[4]?1:0][showFeatures[5]?1:0][showFeatures[6]?1:0], 0, 0);
    done = 1;
  } else if (done == 1) {
    save("output1.jpg");
    for (int i = 0; i < 68; i++) {
      redCross(coords[i][0], coords[i][1]);
    }
    done = 2;
  } else {
    save("output2.jpg");
    exit();
  }
}

void keyReleased() {
  switch (key) {
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
      showFeatures[key-48] = !showFeatures[key-48];
      break;
    
    //case '7':
    //case '8':
    //case '9':
    //  displayMode = key - 48;
    //  break;
  }
}

color[][] loadNoFeatureColours() {
    color[][] noFeatureColours = new color[numberOfCategories][numberOfCategories];
    for (int i = 0; i < noFeatureColours.length; i++) {
      //for (int j = 0; j < noFeatureColours[i].length; j++) {
      //  noFeatureColours[i][j] = color(255, 255, 255, i==j?255:0);
      //}
      noFeatureColours[i][0] = color(128, 128, 128, i==0?255:0);
      noFeatureColours[i][1] = color(255, 0, 0, i==1?255:0);
      noFeatureColours[i][2] = color(0, 255, 0, i==2?255:0);
      noFeatureColours[i][3] = color(0, 0, 255, i==3?255:0);
      noFeatureColours[i][4] = color(0, 255, 255, i==4?255:0);
      noFeatureColours[i][5] = color(255, 0, 255, i==5?255:0);
      noFeatureColours[i][6] = color(255, 255, 0, i==6?255:0);
    }
    color[][] expandedNoFeatureColours = new color[numberOfCategories][numberOfCoordinates];
    for (int i = 0; i < noFeatureColours.length; i++) {
      expandedNoFeatureColours[i] = expandCategoryColours(noFeatureColours[i]);
    }
  return expandedNoFeatureColours;
}

color[][][][][][][][] loadNoFeatureComboColours() {
  color[][][][][][][][] noFeatureComboColours = new color[2][2][2][2][2][2][2][numberOfCategories];
  color[][][][][][][][] expandedNoFeatureComboColours = new color[2][2][2][2][2][2][2][numberOfCoordinates];
  int[] categories = new int[numberOfCategories];
  for (categories[0] = 0; categories[0] < 2; categories[0]++) {
    for (categories[1] = 0; categories[1] < 2; categories[1]++) {
      for (categories[2] = 0; categories[2] < 2; categories[2]++) {
        for (categories[3] = 0; categories[3] < 2; categories[3]++) {
          for (categories[4] = 0; categories[4] < 2; categories[4]++) {
            for (categories[5] = 0; categories[5] < 2; categories[5]++) {
              for (categories[6] = 0; categories[6] < 2; categories[6]++) {
                for (int i = 0; i < numberOfCategories; i++) {
                  //for (int j = 0; j < numberOfCategories; j++) {
                  //  noFeatureComboColours[categories[0]][categories[1]][categories[2]][categories[3]][categories[4]][categories[5]][categories[6]][j] = color(255, 255, 255, categories[j]==1?0:255);
                  //}
                  
                  noFeatureComboColours[categories[0]][categories[1]][categories[2]][categories[3]][categories[4]][categories[5]][categories[6]][0] = color(192, 192, 192, categories[0]==0?255:0);//here
                  noFeatureComboColours[categories[0]][categories[1]][categories[2]][categories[3]][categories[4]][categories[5]][categories[6]][1] = color(255, 64, 64, categories[1]==1?255:0);
                  noFeatureComboColours[categories[0]][categories[1]][categories[2]][categories[3]][categories[4]][categories[5]][categories[6]][2] = color(64, 255, 64, categories[2]==2?255:0);
                  noFeatureComboColours[categories[0]][categories[1]][categories[2]][categories[3]][categories[4]][categories[5]][categories[6]][3] = color(64, 64, 255, categories[3]==3?255:0);
                  noFeatureComboColours[categories[0]][categories[1]][categories[2]][categories[3]][categories[4]][categories[5]][categories[6]][4] = color(64, 255, 255, categories[4]==4?255:0);
                  noFeatureComboColours[categories[0]][categories[1]][categories[2]][categories[3]][categories[4]][categories[5]][categories[6]][5] = color(255, 64, 255, categories[5]==5?255:0);
                  noFeatureComboColours[categories[0]][categories[1]][categories[2]][categories[3]][categories[4]][categories[5]][categories[6]][6] = color(255, 255, 64, categories[6]==6?255:0);
                  
                }
                expandedNoFeatureComboColours[categories[0]][categories[1]][categories[2]][categories[3]][categories[4]][categories[5]][categories[6]] = expandCategoryColours(noFeatureComboColours[categories[0]][categories[1]][categories[2]][categories[3]][categories[4]][categories[5]][categories[6]]);
              }
            }
          }
        }
      }
    }
  }
  return expandedNoFeatureComboColours;
}

color[] expandCategoryColours(color[] c) {
  color[] c2 = new color[numberOfCoordinates];
  for (int i = 0; i < c2.length; i++) {
    if (i <= 16) { // jawline
      c2[i] = c[0];
    } else if (i <= 21) { // right eyebrow
      c2[i] = c[1];
    } else if (i <= 26) { // left eyebrow
      c2[i] = c[2];
    } else if (i <= 35) { // nose
      c2[i] = c[3];
    } else if (i <= 41) { // right eye
      c2[i] = c[4];
    } else if (i <= 47) { // left eye
      c2[i] = c[5];
    } else if (i <= 67) { // mouth
      c2[i] = c[6];
    }
  }
  return c2;
}

int[] calculatePixelCategories(int[][] coords) {
  int[] pC = new int[imageWidth*imageHeight];
  for (int x = 0; x < imageWidth; x++) {
    for (int y = 0; y < imageHeight; y++) {
      float minDistance = distance(x, y, coords[0][0], coords[0][1]);
      int minIndex = 0;
      for (int i = 1; i < coords.length; i++) {
        float distance = distance(x, y, coords[i][0], coords[i][1]);
        if (distance < minDistance) {
          minDistance = distance;
          minIndex = i;
        }
      }
      pC[y*imageWidth+x] = minIndex;
    }
  }
  return pC;
}

PImage newImage(String sketchFileName, int[] pixelCategories, color[] c) {
  int[] simplePixelCategories = new int[pixelCategories.length];
  for (int i = 0; i < pixelCategories.length; i++) {
    if (pixelCategories[i] <= 16) {
      simplePixelCategories[i] = 0;
    } else if (pixelCategories[i] <= 21) {
      simplePixelCategories[i] = 1;
    } else if (pixelCategories[i] <= 26) {
      simplePixelCategories[i] = 2;
    } else if (pixelCategories[i] <= 35) {
      simplePixelCategories[i] = 3;
    } else if (pixelCategories[i] <= 41) {
      simplePixelCategories[i] = 4;
    } else if (pixelCategories[i] <= 47) {
      simplePixelCategories[i] = 5;
    } else {
      simplePixelCategories[i] = 6;
    }
  }
  PImage sketch = loadImage(sketchFileName);
  //int[] actuallyPresent = new int[7];
  //String[] sketchPresent = split(sketchFileName, "-");
  //for (int i = 0; i < pixelCategories.length; i++) {
  //  if (red(sketch.pixels[i]) + green((sketch.pixels[i])) + blue(sketch.pixels[i]) > 50) {
  //    actuallyPresent[pixelCategories[i]] = 1;
  //  }
  //}
  //for (int i = 0; i < actuallyPresent.length; i++) {
  //  String s = sketchPresent[4];
  //  if (actuallyPresent[i] == int(s.charAt(i))) {
  //    println(actuallyPresent[i] + " == " + int(s.charAt(i)));
  //  } else {
  //    println(actuallyPresent[i] + " != " + int(s.charAt(i)));
  //  }
  //}
  PImage n = createImage(imageWidth, imageHeight, RGB);
  n.loadPixels();
  for (int i = 0; i < n.pixels.length; i++) {
    n.pixels[i] = c[pixelCategories[i]];
  }
  n.updatePixels();
  sketch.blend(n, 0, 0, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight, DARKEST);
  n.blend(sketch, 0, 0, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight, DARKEST);
  //return sketch;
  return n;
}

// technically square of the distance
float distance(int x1, int y1, int x2, int y2) {
  return pow((x1-x2), 2) + pow((y1-y2), 2);
}

void redCross(int x, int y) {
  pushMatrix();
  translate(x, y);
  rotate(PI/4);
  shape(redCross, 0, 0);
  popMatrix();
}

void createRedCross() {
    redCross = createShape();
    redCross.beginShape();
    redCross.noStroke();
    redCross.fill(0);
    redCross.vertex(-1, -5);
    redCross.vertex(1, -5);
    redCross.vertex(1, -1);
    redCross.vertex(5, -1);
    redCross.vertex(5, 1);
    redCross.vertex(1, 1);
    redCross.vertex(1, 5);
    redCross.vertex(-1, 5);
    redCross.vertex(-1, 1);
    redCross.vertex(-5, 1);
    redCross.vertex(-5, -1);
    redCross.vertex(-1, -1);
    redCross.endShape(CLOSE);
}
