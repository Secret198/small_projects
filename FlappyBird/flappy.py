import pygame
import random

pygame.init()
pygame.font.init()

window = pygame.display.set_mode((500, 800))
pygame.display.set_caption("Flappy bird")
background = pygame.transform.scale(pygame.image.load('background.png'), (500, 800))
bird = pygame.transform.scale(pygame.image.load('bird2.png'), (68, 48))

floorsur = pygame.transform.scale(pygame.image.load('floor2.png'), (500, 250))
pipesur = pygame.transform.scale(pygame.image.load('Pipe.png'), (104, 784))
downpipe = pipesur
uppipe = pygame.transform.rotate(pipesur, 180)

font = pygame.font.Font('ARCADECLASSIC.TTF', 40)


def make_window(floor1, floor2, downpipe1, downpipe2, uppipe1, uppipe2, bird_pos, bird_movement, score):
    window.blit(background, (0, 0))

    
    window.blit(rotate_bird(bird, -bird_movement * 1.5), (bird_pos.x, bird_pos.y))

    window.blit(downpipe, (downpipe1.x, downpipe1.y))
    window.blit(downpipe, (downpipe2.x, downpipe2.y))
    window.blit(uppipe, (uppipe1.x, uppipe1.y))
    window.blit(uppipe, (uppipe2.x, uppipe2.y))

    window.blit(floorsur, (floor1.x, floor1.y))
    window.blit(floorsur, (floor2.x, floor2.y ))
    display_score(score)
  
    pygame.display.update()

def collision(downpipe1, downpipe2, uppipe1, uppipe2, floor1, floor2, bird_pos):
    if bird_pos.colliderect(floor1) or bird_pos.colliderect(floor2) or bird_pos.colliderect(downpipe1) or bird_pos.colliderect(downpipe2) or bird_pos.colliderect(uppipe1) or bird_pos.colliderect(uppipe2):
        main()

def pipes(downpipe1, downpipe2, uppipe1, uppipe2, bird_pos, score):
    downpipe1.x -= 4
    downpipe2.x -= 4

    uppipe1.x -= 4
    uppipe2.x -= 4


    if downpipe1.x <= 0 - downpipe1.width:
        downpipe1.x = 500
        downpipe1.y = random.uniform(400, 650)
        uppipe1.x = downpipe1.x
        uppipe1.y = downpipe1.y - 200 - uppipe1.height

    if downpipe2.x <= 0 - downpipe2.width:
        downpipe2.x = 500
        downpipe2.y = random.uniform(400, 650)
        uppipe2.x = downpipe2.x
        uppipe2.y = downpipe2.y - 200 - uppipe2.height



def display_score(score):
    score_sur = font.render(str(score), True, (255, 255, 255))
    score_rect = score_sur.get_rect(center=(250, 100))
    window.blit(score_sur, score_rect)

def rotate_bird(bird, bird_movement):
    new_bird = pygame.transform.rotozoom(bird, bird_movement, 1)
    return new_bird
    
def main():
    bird_pos = bird.get_rect(center=(150, 300))

    floor1 = pygame.Rect(0, 700, 500, 200)
    floor2 = pygame.Rect(500, 700, 500, 200)

    downpipe1 = pygame.Rect(600, random.uniform(400, 650), 104, 784)
    downpipe2 = pygame.Rect(900, random.uniform(400, 650), 104, 784)
    uppipe1 = pygame.Rect(downpipe1.x, downpipe1.y - 200 - downpipe1.height, 104, 784)
    uppipe2 = pygame.Rect(downpipe2.x, downpipe2.y - 200 - downpipe2.height, 104, 784)
    
    gravity = 1
    bird_movement = 0

    score = 0

    clock = pygame.time.Clock()


    running = True
    while running:
        clock.tick(60)


        floor1.x -= 4
        floor2.x -= 4

        score += 1
        

        if floor1.x <= 0 - floor1.width:
            floor1.x = 500

        if floor2.x <= 0 - floor2.width:
            floor2.x = 500


        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and bird_pos.y > 0:
                    bird_movement = 0
                    bird_movement -= 15
                  
        bird_movement += gravity
        bird_pos.y += bird_movement

        make_window(floor1, floor2, downpipe1, downpipe2, uppipe1, uppipe2, bird_pos, bird_movement, score)
        pipes(downpipe1, downpipe2, uppipe1, uppipe2, bird_pos, score)
        collision(downpipe1, downpipe2, uppipe1, uppipe2, floor1, floor2, bird_pos)
        
    pygame.quit()
    

if __name__ == '__main__':
    main()