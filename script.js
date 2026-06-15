let highScore =
    localStorage.getItem("highScore") || 0;

document.getElementById("highScore").innerText =
    "High Score: " + highScore;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let score = 0;
let lives = 10;
let gameRunning = true;

const player = {
    width: 60,
    height: 60,
    x: canvas.width / 2 - 30,
    y: canvas.height - 100,
    speed: 12
};

let bullets = [];
let enemies = [];
const keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;

    if (e.code === "Space" && gameRunning) {
        bullets.push({
            x: player.x + player.width / 2 - 3,
            y: player.y,
            width: 20,
            height: 15
        });
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

function drawPlayer() {
    ctx.fillStyle = "cyan";

    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    ctx.lineTo(player.x, player.y + player.height);
    ctx.lineTo(player.x + player.width, player.y + player.height);
    ctx.closePath();

    ctx.fill();
}

function drawBullets() {
    ctx.fillStyle = "white";

    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].y -= 15;

        ctx.fillRect(
            bullets[i].x,
            bullets[i].y,
            bullets[i].width,
            bullets[i].height
        );

        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
        }
    }
}

function spawnEnemy() {
    enemies.push({
        x: Math.random() * (canvas.width - 40),
        y: -40,
        width: 60,
        height: 60,
        speed: 1 + Math.random()
    });
}

setInterval(() => {
    if (gameRunning) {
        spawnEnemy();
    }
}, 2000);

function drawEnemies() {
    ctx.fillStyle = "red";

    for (let e = enemies.length - 1; e >= 0; e--) {

        enemies[e].y += enemies[e].speed;

        ctx.fillRect(
            enemies[e].x,
            enemies[e].y,
            enemies[e].width,
            enemies[e].height
        );

        if (enemies[e].y > canvas.height) {

          enemies.splice(e, 1);

          lives--;

          document.getElementById("lives").innerText =
            "Lives: " + lives;

          if (lives <= 0) {
            gameOver();
        }

    continue;
}

        for (let b = bullets.length - 1; b >= 0; b--) {

            if (
                bullets[b].x < enemies[e].x + enemies[e].width &&
                bullets[b].x + bullets[b].width > enemies[e].x &&
                bullets[b].y < enemies[e].y + enemies[e].height &&
                bullets[b].y + bullets[b].height > enemies[e].y
            ) {

                enemies.splice(e, 1);
                bullets.splice(b, 1);

                score++;

                document.getElementById("score").innerText =
                    "Score: " + score;

                break;
            }
        }
    }
}

function movePlayer() {

    if (keys["ArrowLeft"] && player.x > 0) {
        player.x -= player.speed;
    }

    if (
        keys["ArrowRight"] &&
        player.x < canvas.width - player.width
    ) {
        player.x += player.speed;
    }
}

function gameOver() {

    gameRunning = false;

    alert(
        "🎮 GAME OVER\n\n" +
        "Final Score: " + score
    );

    document.getElementById("gameOver").style.display =
        "block";
}

function restartGame() {

    score = 0;
    lives = 10;

    bullets = [];
    enemies = [];

    player.x = canvas.width / 2 - 30;

    document.getElementById("score").innerText =
        "Score: 0";

    document.getElementById("lives").innerText =
        "Lives: 10";

    document.getElementById("gameOver").style.display =
        "none";

    gameRunning = true;
}

function animate() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (gameRunning) {
        movePlayer();
        drawPlayer();
        drawBullets();
        drawEnemies();
    }

    requestAnimationFrame(animate);
}

animate();