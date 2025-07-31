#include <iostream>
#include <glad/glad.h>
#include <GLFW/glfw3.h>
#include <sstream>
#include <fstream>
#include <vector>
#include <cmath>
#include <Windows.h>

using namespace std;



enum Modes {
	WALL,
	START,
	END
};

struct Node
{
	int i;
	int j;
	int cost;

	Node(int i, int j, int cost) {
		this->i = i;
		this->j = j;
		this->cost = cost;
	}
};



int width = 800;
int height = 600;

const int cellHorizontal = 7;
const int cellVertical = 10;

int fps = 60;

double mouseX, mouseY;

int mode = WALL;

bool graph[cellHorizontal + 2][cellVertical + 2];

int startX = 0;
int startY = 0;
int endX = 0;
int endY = 0;

vector<Node> visited;
vector<Node> discovered;
vector<Node> route;

bool found = false;
bool stop = false;

void checkCompileErrors(unsigned int shader, string type);
void mouse_button_callback(GLFWwindow* window, int button, int action, int mods);
void getColor(float red, float green, float blue, float(&color)[4]);
Node MinDiscovered(vector<Node>& discovered);
bool Contains(vector<Node>& list, int row, int col);
int IndexOf(vector<Node>& arr, Node theNode);
void UpdateCost(vector<Node>& discovered, int row, int col, int newCost);
//void Dijkstra(vector<Node>& discovered, vector<Node>& visited, vector<Node>& route, bool& found, bool& stop);
void Dijkstra();
int FindNode(vector<Node> arr, int row, int col);
Node NextInRoute(Node node, bool grid[9][12], vector<Node>& visited);
void GenerateMatrix();
void HandleMouse();
void Restart();

int main() {
	
	glfwInit();
	glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	glfwWindowHint(GLFW_OPENGL_CORE_PROFILE, GLFW_OPENGL_CORE_PROFILE);
	glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);

	GLFWwindow* window = glfwCreateWindow(width, height, "Graphs", NULL, NULL);

	if (window == NULL) {
		glfwTerminate();
		cout << "Failed to create window" << endl;
		return -1;
	}
	glfwMakeContextCurrent(window);

	if (!gladLoadGLLoader((GLADloadproc)glfwGetProcAddress)) {
		std::cout << "Failed to load opengl" << std::endl;
		return -1;
	}

	glViewport(0, 0, width, height);

	glfwSetMouseButtonCallback(window, mouse_button_callback);

	float squareVerticies[] = {
	-1.0f, -1.0f, 0.0f, -1.0f, 1.0f, 0.0f,
	1.0f, -1.0f, 0.0f, 1.0f, 1.0f, 0.0f
	};

	unsigned int squareIndices[] = {
		0, 1, 2,
		3, 1, 2
	};

	unsigned int EBO;
	glGenBuffers(1, &EBO);
	

	unsigned int VBO;
	glGenBuffers(1, &VBO);

	unsigned int VAO;
	glGenVertexArrays(1, &VAO);
	glBindVertexArray(VAO);

	glBindBuffer(GL_ARRAY_BUFFER, VBO);
	glBufferData(GL_ARRAY_BUFFER, sizeof(squareVerticies), squareVerticies, GL_STATIC_DRAW);

	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, EBO);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(squareIndices), squareIndices, GL_STATIC_DRAW);

	glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 3 * sizeof(float), (void*)0);
	glEnableVertexAttribArray(0);

	glBindVertexArray(0);

	//read shaders
	string vertexCode;
	string fragmentCode;
	ifstream vShaderFile, fShaderFile;

	vShaderFile.exceptions(ifstream::failbit | ifstream::badbit);
	fShaderFile.exceptions(ifstream::failbit | ifstream::badbit);

	try {
		vShaderFile.open("E:/projects/small_projects/dijkstraVisualization/c++/graphs/Graphs/vertexShader.glsl");
		fShaderFile.open("E:/projects/small_projects/dijkstraVisualization/c++/graphs/Graphs/fragmentShader.glsl");

		stringstream vShaderStream, fShaderStream;
		vShaderStream << vShaderFile.rdbuf();
		fShaderStream << fShaderFile.rdbuf();

		vShaderFile.close();
		fShaderFile.close();

		vertexCode = vShaderStream.str();
		fragmentCode = fShaderStream.str();
	}
	catch (ifstream::failure err) {
		cout << "Failed to read shaders: " << endl;
	}

	const char* vShadercode = vertexCode.c_str();
	const char* fShadercode = fragmentCode.c_str();

	//Create shaders and shader program
	unsigned int vertexShader;
	vertexShader = glCreateShader(GL_VERTEX_SHADER);
	glShaderSource(vertexShader, 1, &vShadercode, NULL);
	glCompileShader(vertexShader);
	checkCompileErrors(vertexShader, "VERTEX");

	unsigned int fragmentShader;
	fragmentShader = glCreateShader(GL_FRAGMENT_SHADER);
	glShaderSource(fragmentShader, 1, &fShadercode, NULL);
	glCompileShader(fragmentShader);
	checkCompileErrors(fragmentShader, "FRAGMENT");

	unsigned int shaderProgram;
	shaderProgram = glCreateProgram();
	glAttachShader(shaderProgram, vertexShader);
	glAttachShader(shaderProgram, fragmentShader);
	glLinkProgram(shaderProgram);
	checkCompileErrors(shaderProgram, "PROGRAM");

	glDeleteShader(vertexShader);
	glDeleteShader(fragmentShader);

	//Matrix and stuff


	float model[4][4] = {
		{1.0f, 0.0f, 0.0f, 0.0f },
		{0.0f, 1.0f, 0.0f, 0.0f},
		{0.0f, 0.0f, 1.0f, 0.0f},
		{0.0f, 0.0f, 0.0f, 1.0f},
	};
	
	float cellRowCount = 7.0f;
	float cellColCount = 10.0f;

	int borderWidthScreen = 2;

	float borderWidth = (static_cast<float>(borderWidthScreen) / static_cast<float>(width)) * 2;


	//int cellWidthScreen = (width - ((static_cast<int>(cellColCount) + 1) * borderWidthScreen)) / static_cast<int>(cellColCount);
	//int cellHeightScreen = (height - ((static_cast<int>(cellRowCount) + 1) * borderWidthScreen)) / static_cast<int>(cellRowCount);

	float cellWidthScreen = static_cast<float>(width) / static_cast<int>(cellColCount);
	float cellHeightScreen = static_cast<float>(height) / static_cast<int>(cellRowCount);


	float cellWidth = (cellWidthScreen / static_cast<float>(width));
	float cellHeight = (cellHeightScreen / static_cast<float>(height));


	model[0][0] = cellWidth;
	model[1][1] = cellHeight;

	GenerateMatrix();





	while (!glfwWindowShouldClose(window))
	{
		float frameStart = GetTickCount64();

		if (mode > END && discovered.size() == 0) {
			discovered.push_back(Node(startY, startX, 0));
		}

		if (!stop && mode > END) {
			Dijkstra();
		}


		glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
		glClear(GL_COLOR_BUFFER_BIT);

		glUseProgram(shaderProgram);
		glBindVertexArray(VAO);

		/*model[0][3] = -1.0f;
		model[1][3] = -1.0f;

		glUniformMatrix4fv(glGetUniformLocation(shaderProgram, "model"), 1, GL_TRUE, &model[0][0]);
		glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);*/


		for (int i = 0; i < static_cast<int>(cellColCount); i++)
		{
			for (int j = 0; j < static_cast<int>(cellRowCount); j++)
			{
				model[0][3] =  static_cast<float>(i) * (cellWidth * 2.0f) - (1.0f - cellWidth);
				model[1][3] = - (static_cast<float>(j) * (cellHeight * 2.0f) - (1.0f - cellHeight));

				glUniformMatrix4fv(glGetUniformLocation(shaderProgram, "model"), 1, GL_TRUE, &model[0][0]);

				float color[4];

				
				if (i+1 == startX && j+1 == startY) {
					getColor(0.0f, 0.0f, 1.0f, color);
				}
				else if (i+1 == endX && j+1 == endY) {
					getColor(0.0f, 1.0f, 0.0f, color);
				}
				else if (Contains(route, j+1, i+1)) {
					getColor(0.5f, 0.0f, 0.2f, color);
				}
				else if (Contains(visited, j+1, i+1)) {
					getColor(0.9f, 0.5f, 0.5f, color);
				}
				else if (Contains(discovered, j + 1, i + 1)) {
					getColor(0.1f, 0.2f, 0.1f, color);
				}
				else if (!graph[j + 1][i + 1]) {
					getColor(0.0f, 0.0f, 0.0f, color);
				}
				else {
					getColor(1.0f, 1.0f, 1.0f, color);
				}

				glUniform4fv(glGetUniformLocation(shaderProgram, "inputColor"), 1, &color[0]);

				glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
			}
		}



		glfwSwapBuffers(window);
		glfwPollEvents();
		float frameEnd = GetTickCount64();
		//Sleep(1000.0f / static_cast<float>(fps) - (frameEnd - frameStart));
		Sleep(10);
	}

}

void checkCompileErrors(unsigned int shader, string type) {
	int success;
	char infolog[1024];
	if (type != "PROGRAM") {
		glGetShaderiv(shader, GL_COMPILE_STATUS, &success);
		if (!success) {
			glGetShaderInfoLog(shader, 1024, NULL, infolog);
			cout << "Failed to compile shader: " << type << "\n" << infolog << endl;
		}
	}
	else {
		glGetProgramiv(shader, GL_LINK_STATUS, &success);
		if (!success) {
			glGetProgramInfoLog(shader, 1024, NULL, infolog);
			cout << "Shader program linking error: " << type << "\n" << infolog << endl;
		}
	}
}

void mouse_button_callback(GLFWwindow* window, int button, int action, int mods) {
	if (button == GLFW_MOUSE_BUTTON_1 && action == GLFW_PRESS) {
		glfwGetCursorPos(window, &mouseX, &mouseY);
		HandleMouse();
	}
	else if (button == GLFW_MOUSE_BUTTON_2 && action == GLFW_PRESS) {
		mode++;
	}
	else if (button == GLFW_MOUSE_BUTTON_3 && action == GLFW_PRESS) {
		Restart();
	}
}

void getColor(float red, float green, float blue, float (&color)[4]) {
	color[0] = red;
	color[1] = green;
	color[2] = blue;
	color[3] = 1.0f;
};

void Dijkstra() {

	if (!found) {
		Node currentNode = MinDiscovered(discovered);

		for (int i = -1; i <= 1; i++)
		{
			for (int j = -1; j <= 1; j++)
			{
				if (i != 0 || j != 0) {
					int row = currentNode.i + i;
					int col = currentNode.j + j;
					int cost = currentNode.cost;

					if (graph[row][col] && !Contains(discovered, row, col) && !Contains(visited, row, col))
					{
						Node discoveredNode = Node(row, col, cost + (static_cast<int>(sqrt(abs(i) + abs(j)) * 10)));
						discovered.push_back(discoveredNode);
					}
					else if (graph[row][col] && Contains(discovered, row, col) && !Contains(visited, row, col) && discovered[FindNode(discovered, row, col)].cost < currentNode.cost + sqrt(abs(i) + abs(j)) ) {

						UpdateCost(discovered, row, col, cost + (sqrt(abs(i) + abs(j))));
					}
				}
			}
		}

		if (currentNode.i == endY && currentNode.j == endX) {
			found = true;
		}
		visited.push_back(currentNode);
		discovered.erase(discovered.begin() + IndexOf(discovered, currentNode));
	}
	else {
		Node currentNode = visited.at(visited.size() - 1);
		route.push_back(currentNode);

		while (currentNode.i != startY || currentNode.j != startX)
		{
			currentNode = NextInRoute(currentNode, graph, visited);
			route.push_back(currentNode);
		}

		stop = true;
	}
	
}

Node NextInRoute(Node node, bool grid[9][12], vector<Node> &visited) {
	int minCost = node.cost;
	int minIndex = FindNode(visited, node.i, node.j);
	for (int i = -1; i <= 1; i++)
	{
		for (int j = -1; j <= 1; j++)
		{
			if (i != 0 || j != 0) {
				int adjecentNodeIndex = FindNode(visited, node.i + i, node.j + j);
				if (adjecentNodeIndex != -1) {
					Node adjecentNode = visited[adjecentNodeIndex];
					if (grid[node.i + i][node.j + j] && adjecentNode.cost < minCost)
					{
						minCost = adjecentNode.cost;
						minIndex = adjecentNodeIndex;
					}
				}
				
			}
			
		}
	}
	return visited[minIndex];
}

bool Contains(vector<Node>& list, int row, int col) {
	for (int i = 0; i < list.size(); i++)
	{
		if (list[i].i == row && list[i].j == col) {
			return true;
		}

	}
	return false;

}

Node MinDiscovered(vector<Node>& discovered) {
	int minCost = -1;
	int minIndex = 0;

	for (int i = 0; i < discovered.size(); i++)
	{
		if (minCost == -1 || discovered[i].cost < minCost) {
			minIndex = i;
			minCost = discovered[i].cost;
		}
	}
	return discovered[minIndex];
}

void UpdateCost(vector<Node>& discovered, int row, int col, int newCost) {
	for (int i = 0; i < discovered.size(); i++)
	{
		if (discovered[i].i == row && discovered[i].j == col) {
			discovered[i].cost = newCost;
			break;
		}
	}
}

int IndexOf(vector<Node>& arr, Node theNode) {
	for (int i = 0; i < arr.size(); i++)
	{
		if (arr[i].i == theNode.i && arr[i].j == theNode.j) {
			return i;
		}
	}
	return -1;
}

int FindNode(vector<Node> arr, int row, int col) {
	for (int i = 0; i < arr.size(); i++)
	{
		if (arr[i].i == row && arr[i].j == col) {
			return i;
		}
	}
	return -1;
}

void GenerateMatrix()
{
	memset(graph[0], false, sizeof(graph[0]));
	for (int i = 1; i < sizeof(graph)/sizeof(graph[0])-1; i++)
	{
		memset(graph[i], true, sizeof(graph[i]));
		graph[i][0] = false;
		graph[i][cellVertical+1] = false;
	}
	memset(graph[cellHorizontal+1], false, sizeof(graph[0]));
}

void HandleMouse() {
	double cellWidth = width / cellVertical;
	double cellHeight = height / cellHorizontal;
	switch (mode) {
	case WALL:

		graph[static_cast<int>(mouseY / cellHeight) + 1][static_cast<int>(mouseX / cellWidth) + 1] = false;
		break;
	case START:
		startX = static_cast<int>(mouseX / cellWidth) + 1;
		startY = static_cast<int>(mouseY / cellHeight) + 1;
		break;
	case END:
		endX = static_cast<int>(mouseX / cellWidth) + 1;
		endY = static_cast<int>(mouseY / cellHeight) + 1;
		break;
	}

}

void Restart() {
	GenerateMatrix();
	mode = WALL;
	stop = false;
	found = false;
	discovered.clear();
	visited.clear();
	route.clear();
	startX = 0;
	startY = 0;
	endX = 0;
	endY = 0;
}