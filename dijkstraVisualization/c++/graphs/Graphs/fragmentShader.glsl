#version 330 core

out vec4 fragColor;

vec4 orangeColor = vec4(1.0, 0.5, 0.2, 1.0);

uniform vec4 inputColor;

void main()
{
    fragColor = inputColor;
};