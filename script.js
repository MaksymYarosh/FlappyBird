const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let frames = 0;
const gravity = 0.25;
const jump = 4.6;
let score = 0;

// Bird
const bird = {
    x: 50,
    y: 150,
    width: 30,
    height: 30,
    velocity: 0,
    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    },
    flap() {
        this.velocity = -jump;
    },
    update() {
        this.velocity += gravity;
        this.y += this.velocity;
        if (this.y + this.height >= canvas.height) {
            this.y = canvas.height - this.height;
            gameOver();
        }
    }
};

// Pipes
const pipes = [];
const pipeWidth = 50;
const pipeGap = 120;
function spawnPipe() {
    const topHeight = Math.random() * (canvas.height / 2);
    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + pipeGap
    });
}

// Input
document.addEventListener('keydown', e => {
    if (e.code === 'Space') bird.flap();
});
canvas.addEventListener('click', () => bird.flap());

// Main loop
function update() {
    frames++;
    bird.update();

    if (frames % 90 === 0) spawnPipe();

    // Update pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        const p = pipes[i];
        p.x -= 2;

        // Check collision
        if (
            bird.x < p.x + pipeWidth &&
            bird.x + bird.width > p.x &&
            (bird.y < p.top || bird.y + bird.height > p.bottom)
        ) {
            gameOver();
        }

        // Score
        if (p.x + pipeWidth === bird.x) {
            score++;
        }

        // Remove off-screen pipes
        if (p.x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pipes
    ctx.fillStyle = 'green';
    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        ctx.fillRect(p.x, p.bottom, pipeWidth, canvas.height - p.bottom);
    });

    // Draw bird
    bird.draw();

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function gameOver() {
    alert(`Game Over! Score: ${score}`);
    document.location.reload();
}

// Start game
loop();
