import pygame
pygame.font.init()

WIDTH, HEIGHT = 800, 600

SCREEN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Game yay')

FPS = 60
SHIP_WIDTH = 60
SHIP_HEIGHT = 60
VEL = 5
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (255, 0, 0)
BLUE = (0, 0, 255)
BORDER = pygame.Rect(WIDTH//2-5, 0, 10, 600)
BULLET_VEL = 7
MAX_BULLET = 5

RED_HIT = pygame.USEREVENT + 1
BLUE_HIT = pygame.USEREVENT + 2

HEALTH_FONT = pygame.font.SysFont('comicsans', 40)
WINNER_FONT = pygame.font.SysFont('comicsans', 100)

RED_SPACESHIP = pygame.image.load('red_ship.png')
RED_RESIZED = pygame.transform.rotate(pygame.transform.scale(RED_SPACESHIP, (SHIP_WIDTH, SHIP_HEIGHT)), -90)
BLUE_SPACESHIP = pygame.image.load('blue_ship.png')
BLUE_RESIZED = pygame.transform.rotate(pygame.transform.scale(BLUE_SPACESHIP, (SHIP_WIDTH, SHIP_HEIGHT)), 90)
BG = pygame.transform.scale(pygame.image.load('background.jpg'), (WIDTH, HEIGHT))

def draw_winner(text):
    draw_text = WINNER_FONT.render(text, 1, WHITE)
    SCREEN.blit(draw_text, (WIDTH//2 - draw_text.get_width()//2, HEIGHT//2 - draw_text.get_height()//2))
    pygame.display.update()
    pygame.time.delay(5000)

def draw_window(red, blue, red_bullet, blue_bullet, red_health, blue_health):
    SCREEN.blit(BG, (0, 0))
    pygame.draw.rect(SCREEN, BLACK, BORDER)

    red_health_text = HEALTH_FONT.render("Health: " + str(red_health), 1, WHITE)
    blue_health_text = HEALTH_FONT.render("Health " + str(blue_health), 1, WHITE)
    SCREEN.blit(red_health_text, (10, 10))
    SCREEN.blit(blue_health_text, (WIDTH - blue_health_text.get_width() - 10, 10))

    SCREEN.blit(RED_RESIZED, (red.x, red.y))
    SCREEN.blit(BLUE_RESIZED, (blue.x, blue.y))

    for bullet in red_bullet:
        pygame.draw.rect(SCREEN, RED, bullet)

    for bullet in blue_bullet:
        pygame.draw. rect(SCREEN, BLUE, bullet)

    pygame.display.update()

def red_movement(key_pressed, red):
    if key_pressed[pygame.K_a] and red.x > 0: #Left
            red.x -= VEL
    if key_pressed[pygame.K_d] and red.x + red.width < BORDER.x: #Right
        red.x += VEL
    if key_pressed[pygame.K_w] and red.y > 0: #Up
        red.y -= VEL
    if key_pressed[pygame.K_s] and red.y < HEIGHT - 50: #Down
        red.y += VEL

def blue_movement(key_pressed, blue):
    if key_pressed[pygame.K_LEFT] and blue.x > BORDER.x: #Left
        blue.x -= VEL
    if key_pressed[pygame.K_RIGHT] and blue.x < WIDTH - 60: #Right
        blue.x += VEL
    if key_pressed[pygame.K_UP] and blue.y > 0: #Up
        blue.y -= VEL
    if key_pressed[pygame.K_DOWN] and blue.y < HEIGHT - 50: #Down
        blue.y += VEL

def handle_bullet(red_bullet, blue_bullet, red, blue):
    for bullet in blue_bullet:
        bullet.x -= BULLET_VEL
        if red.colliderect(bullet):
            pygame.event.post(pygame.event.Event(RED_HIT))
            blue_bullet.remove(bullet)
        elif bullet.x < 0:
            blue_bullet.remove(bullet)

    for bullet in red_bullet:
        bullet.x += BULLET_VEL
        if blue.colliderect(bullet):
            pygame.event.post(pygame.event.Event(BLUE_HIT))
            red_bullet.remove(bullet)
        elif bullet.x > WIDTH:
            red_bullet.remove(bullet)

def main():
    red = pygame.Rect(100, 300, SHIP_WIDTH, SHIP_HEIGHT)
    blue = pygame.Rect(700, 300, SHIP_WIDTH, SHIP_HEIGHT)

    red_bullet = []
    blue_bullet = []

    red_health = 10
    blue_health = 10

    running = True
    clock = pygame.time.Clock()
    while running:
        clock.tick(FPS)

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
                pygame.quit()

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE and len(red_bullet) < MAX_BULLET:
                    bullet = pygame.Rect(red.x + red.width, red.y + red.height//2, 10, 10)
                    red_bullet.append(bullet)
                if event.key == pygame.K_RSHIFT and len(blue_bullet) < MAX_BULLET:
                    bullet = pygame.Rect(blue.x, blue.y + blue.height//2, 10, 10)
                    blue_bullet.append(bullet)

            if event.type == RED_HIT:
                red_health -= 1
            if event.type == BLUE_HIT:
                blue_health -= 1

        winner_text = ""

        if red_health <= 0:
            winner_text = "Blue Wins!"

        if blue_health <= 0:
            winner_text = "Red Wins!"

        if winner_text != "":
            draw_winner(winner_text)
            break
        
        key_pressed = pygame.key.get_pressed()
        red_movement(key_pressed, red)
        blue_movement(key_pressed, blue)

        handle_bullet(red_bullet, blue_bullet, red, blue)
        
        draw_window(red, blue, red_bullet, blue_bullet, red_health, blue_health)
    main()

if __name__ == '__main__':
    main()