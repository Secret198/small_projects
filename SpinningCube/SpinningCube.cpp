#include <iostream>
#include <stdlib.h>
#include <Windows.h>

using namespace std;

float rotationX, rotationY, rotationZ;
float coordX, coordY, coordZ;

float cubeWidth = 40;
const int screenWidth = 80;
const int screenHeight = 44;
float z_buffer[screenWidth * screenHeight];
char colorBuffer[screenWidth * screenHeight];
char backgroundCharacter = ' ';
int cameraDistance = 100;
float oneOverZ;
float camToScreenDist = 40;
int xProjection, yProjection;
int idx;

float calcX(float i, float j, float k) {
	return j * sin(rotationX) * sin(rotationY) * cos(rotationZ) - k * cos(rotationX) * sin(rotationY) * cos(rotationZ) + j * cos(rotationX) * sin(rotationZ) + k * sin(rotationX) * sin(rotationZ) + i * cos(rotationY) * cos(rotationZ);
}

float calcY(float i, float j, float k) {
	return j * cos(rotationX) * cos(rotationZ) + k * sin(rotationX) * cos(rotationZ) - j * sin(rotationX) * sin(rotationY) * sin(rotationZ) + k * cos(rotationX) * sin(rotationY) * sin(rotationZ) - i * cos(rotationY) * sin(rotationZ);
}

float calcZ(float i, float j, float k) {
	return k * cos(rotationX) * sin(rotationY) - j * sin(rotationX) * cos(rotationY) + i * sin(rotationY);
}

void calculatePoint(float i, float j, float k, char character) {
	coordX = calcX(i, j, k);
	coordY = calcY(i, j, k);
	coordZ = calcZ(i, j, k) + cameraDistance;
	oneOverZ = 1 / coordZ;

	xProjection = (int)(screenWidth / 2 + camToScreenDist * oneOverZ * coordX * 2);
	yProjection = (int)(screenHeight / 2 + camToScreenDist * oneOverZ * coordY);

	idx = yProjection * screenWidth + xProjection;

	
	if (oneOverZ > z_buffer[idx]) {
		z_buffer[idx] = oneOverZ;
		colorBuffer[idx] = character;
	}
	
}

int main()
{
	printf("\x1b[2J");

	while (true) {

		memset(colorBuffer, backgroundCharacter, screenWidth * screenHeight);
		memset(z_buffer, 0, screenWidth * screenHeight*4);

		for (float i = -cubeWidth / 2.0f; i < cubeWidth / 2.0f; i += 0.15f)
		{
			for (float j = -cubeWidth / 2.0f; j < cubeWidth / 2.0f; j += 0.15f) {
				calculatePoint(i, j, -cubeWidth / 2.0f, '@');
				calculatePoint(cubeWidth / 2.0f, j, i, '$');
				calculatePoint(-cubeWidth / 2.0f, j, -i, '~');
				calculatePoint(-i, j, cubeWidth / 2.0f, '#');
				calculatePoint(i, -cubeWidth / 2.0f, -j, ';');
				calculatePoint(i, cubeWidth / 2.0f, j, '+');
			}
		}
		printf("\x1b[H");
		for (int i = 0; i < screenWidth * screenHeight; i++)
		{
			putchar(i % screenWidth ? colorBuffer[i] : 10);
		}

		rotationX += 0.05;
		rotationY += 0.05;
		rotationZ += 0.05;

		Sleep(10);
	}

	


}

