```javascript
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

const GRID = 20;
const SIZE = 20;

let snake = [{ x: 10, y: 10 }];
let direction = { x: 1, y: 0 };

let food = randomFood();
let score = 0;
let gameOver = false;

function randomFood() {
    return {
        x: Math.floor(Math.random() * GRID),
        y: Math.floor(Math.random() * GRID)
    };
}

document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y !== 1) {
                direction = { x: 0, y: -1 };
            }
            break;

        case "ArrowDown":
            if (direction.y !== -1) {
                direction = { x: 0, y: 1 };
            }
            break;

        case "ArrowLeft":
            if (direction.x !== 1) {
                direction = { x: -1, y: 0 };
            }
            break;

        case "ArrowRight":
            if (direction.x !== -1) {
                direction = { x: 1, y: 0 };
            }
            break;
    }
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Food
    ctx.fillStyle = "red";
    ctx.fillRect(
        food.x * SIZE,
        food.y * SIZE,
        SIZE,
        SIZE
    );

    // Snake
    ctx.fillStyle = "green";

    snake.forEach(segment => {
        ctx.fillRect(
            segment.x * SIZE,
            segment.y * SIZE,
            SIZE,
            SIZE
        );
    });

    if (gameOver) {
        ctx.fillStyle = "black";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over", 110, 200);
    }
}

function update() {
    if (gameOver) {
        draw();
        return;
    }

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y
    };

    // Wall collision
    if (
        head.x < 0 ||
        head.x >= GRID ||
        head.y < 0 ||
        head.y >= GRID
    ) {
        gameOver = true;
        draw();
        return;
    }

    // Self collision
    if (
        snake.some(
            segment =>
                segment.x === head.x &&
                segment.y === head.y
        )
    ) {
        gameOver = true;
        draw();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        food = randomFood();
    } else {
        snake.pop();
    }

    draw();
}

draw();
setInterval(update, 150);
```
