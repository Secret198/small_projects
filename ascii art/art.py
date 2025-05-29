import cv2 as cv
import numpy as np

img = cv.imread("D:/projects/ascii art/image.png")

gray = cv.cvtColor(img, cv.COLOR_BGR2GRAY)

# cv.imshow("Test", gray)

oneLine = []
shortRow = 0

row = int(len(gray)/200)
col = int(len(gray[0])/100)
colNum = int(len(gray[0])/col)

downImage = [[]]

szum = 0

characters = ".,-~:;=!*#$@"
dark = "@$#*!=;:~-,."


for i in gray:
    if shortRow > row:
        for v in range(len(oneLine)):
            oneLine[v] = int(oneLine[v] / (row*col))
        downImage.append(oneLine)
        oneLine = []
        shortRow = 0
    for j in range(0, colNum):
        for k in range(0, col):
            szum += i[j*col+k]
        if shortRow == 0:
            oneLine.append(szum)
        else:
            oneLine[j] += szum
        szum = 0
    shortRow += 1


shaderIncr = 255 / len(characters)
art = []

line = []

check = open("D:/projects/ascii art/textArt.txt", "w")
check.write("")
check.close()


f = open("D:/projects/ascii art/textArt.txt", "a")

for i in downImage:
    for j in i:
        if j >= 255:
            temp = 11
        else:
            temp = int(j / shaderIncr)
        line.append(dark[temp])
        f.write(dark[temp])
    art.append(line)
    line = []
    f.write("\n")

f.close()

cv.waitKey(0)