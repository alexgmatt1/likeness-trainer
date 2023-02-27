from imutils import face_utils
import numpy as np
import dlib
import cv2

import os

def predict_face(fileloc):
    p = "shape_predictor_68_face_landmarks.dat"
    facedetect = dlib.get_frontal_face_detector()
    pred = dlib.shape_predictor(p)
    
    img = cv2.imread(fileloc, cv2.COLOR_BGR2GRAY)
    rects = facedetect(img, 0)
    data = []
    print(len(rects))

    rect = rects[0]
    prediction = pred(img, rect)
    points = face_utils.shape_to_np(prediction)

    dicti ={'jaw': points[0:16], 'rbrow': points[17:21], 'lbrow': points[22:26], 'nose': points[27:35], 'reye': points[36:41], 'leye': points[42:47], 'mouth': points[48:67]}
    return dicti

def predict_sketch(fileloc):
    predict_face(fileloc)


def write_face_to_file(fileloc):
    f = open("demofile2.csv", "w")
    data = predict_face(fileloc)
    for k, v in data.items():
        first = True
        for (x,y) in enumerate(v):
            if not first:
                f.write(",")
            else:
                first = False
            f.write(str(y[0])+","+str(y[1]))
        f.write("\n")
    f.close()


def display_img(fileloc):
    colors = [(255,255,0),(255,0,128),(0,255,0),(255, 0,255),(255,128,0),(0, 128 ,255),(0,0,255)]
    img = cv2.imread(fileloc, cv2.COLOR_BGR2GRAY) 
    dicti = predict_face(fileloc)
    for i, (k, v) in enumerate(dicti.items()):
        col = list(np.random.choice(range(256), size=3))
        cv2.putText(img, k, v[0], cv2.FONT_HERSHEY_PLAIN , 1, colors[i])
        for (x,y) in v:
            cv2.circle(img, (x, y), 2, colors[i], -1)

        cv2.imshow("Output", img)
        k = cv2.waitKey(5) & 0xFF


write_face_to_file("./Artist1/Drawing1/100.tif")
display_img("./Artist1/Drawing1/100.tif")



