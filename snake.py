from pyscript import window
from js import document
from pyodide.ffi import create_proxy
import random

canvas = document.getElementById("game")
ctx = canvas.getContext("2d")

GRID = 20
SIZE = 20

snake = [(10, 10)]
direction = (1, 0)

food = (
    random.randint(0, GRID - 1),
    random.randint(0, GRID - 1)
)

game_over = False


def keydown(event):
    global direction

    key = event.key

    if key == "ArrowUp" and direction != (0, 1):
        direction = (0, -1)

    elif key == "ArrowDown" and direction != (0, -1):
        direction = (0, 1)

    elif key == "ArrowLeft" and direction != (1, 0):
        direction = (-1, 0)

    elif key == "ArrowRight" and direction != (-1, 0):
        direction = (1, 0)


def draw():
    ctx.fillStyle = "white"
    ctx.fillRect(0, 0, 400, 400)

    # Food
    ctx.fillStyle = "red"
    ctx.fillRect(food[0] * SIZE, food[1] * SIZE, SIZE, SIZE)

    # Snake
    ctx.fillStyle = "green"
    for x, y in snake:
        ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE)

    if game_over:
        ctx.fillStyle = "black"
        ctx.font = "30px Arial"
        ctx.fillText("Game Over", 120, 200)


def update():
    global food, game_over

    if game_over:
        draw()
        return

    head_x, head_y = snake[0]

    dx, dy = direction

    new_head = (
        head_x + dx,
        head_y + dy
    )

    # Wall collision
    if (
        new_head[0] < 0
        or new_head[0] >= GRID
        or new_head[1] < 0
        or new_head[1] >= GRID
    ):
        game_over = True
        draw()
        return

    # Self collision
    if new_head in snake:
        game_over = True
        draw()
        return

    snake.insert(0, new_head)

    if new_head == food:
        food = (
            random.randint(0, GRID - 1),
            random.randint(0, GRID - 1)
        )
    else:
        snake.pop()

    draw()


keydown_proxy = create_proxy(keydown)
document.addEventListener("keydown", keydown_proxy)

draw()

update_proxy = create_proxy(update)
window.setInterval(update_proxy, 150)