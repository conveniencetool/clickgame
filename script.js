let score = 0;
let timer;
let timeLeft = 1.0;
let totalClickTime = 0;
let clickCount = 0;
let missedClicks = 0;

const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const circle = document.getElementById('circle');
const gameArea = document.getElementById('gameArea');
const gameOverDisplay = document.getElementById('gameOver');
const continueButton = document.getElementById('continueButton');
const finalScoreDisplay = document.getElementById('finalScore');
const startScreen = document.getElementById('startScreen');
const analysisDisplay = document.getElementById('analysis');

function startGame() {
    startScreen.style.display = 'none';
    gameArea.style.display = 'block';
    score = 0;
    timeLeft = 1.0;
    totalClickTime = 0;
    clickCount = 0;
    missedClicks = 0;

    scoreDisplay.textContent = 'スコア: ' + score;
    timerDisplay.textContent = 'タイマー: ' + timeLeft.toFixed(2) + '秒';
    moveCircle();
    startTimer();
}

function startTimer() {
    timeLeft = 1.0;
    timer = setInterval(() => {
        timeLeft -= 0.01;
        timerDisplay.textContent = 'タイマー: ' + timeLeft.toFixed(2) + '秒';
        if (timeLeft <= 0) {
            gameOver();
        }
    }, 10);
}

function moveCircle() {
    const maxX = gameArea.clientWidth - circle.clientWidth;
    const maxY = gameArea.clientHeight - circle.clientHeight;
    circle.style.left = Math.random() * maxX + 'px';
    circle.style.top = Math.random() * maxY + 'px';
}

circle.addEventListener('click', function(event) {
    const clickDuration = 1.0 - timeLeft;
    totalClickTime += clickDuration;
    clickCount++;

    score += 1;
    scoreDisplay.textContent = 'スコア: ' + score;
    moveCircle();
    clearInterval(timer);
    timeLeft = Math.max(1.0 - (Math.floor(score / 10) * 0.1), 0.1);
    startTimer();
    event.stopPropagation();
});

gameArea.addEventListener('click', function(event) {
    if (event.target !== circle) {
        missedClicks++;
        gameOver();
    }
});

function gameOver() {
    clearInterval(timer);
    gameOverDisplay.style.display = 'block';
    continueButton.style.display = 'block';
    finalScoreDisplay.style.display = 'block';
    finalScoreDisplay.textContent = '最終スコア: ' + score;
    circle.style.display = 'none';

    displayAnalysis();
}

function displayAnalysis() {
    analysisDisplay.style.display = 'block';

    let performance;
    if (score >= 30) {
        performance = "Excellent!";
    } else if (score >= 15) {
        performance = "Good!";
    } else {
        performance = "Needs Improvement";
    }

    const avgClickTime = clickCount > 0 ? (totalClickTime / clickCount).toFixed(2) : 0;
    const successRate = ((clickCount / (clickCount + missedClicks)) * 100).toFixed(2);

    analysisDisplay.innerHTML = `
        <h2>ゲーム分析</h2>
        <p>評価: ${performance}</p>
        <p>平均クリック時間: ${avgClickTime} 秒</p>
        <p>クリック成功率: ${successRate}%</p>
    `;
}

function continueGame() {
    location.reload();
}

document.addEventListener('keydown', function(event) {
    if (event.code === 'Space') {
        if (gameOverDisplay.style.display === 'block') {
            continueGame();
        } else {
            startGame();
        }
    }
});
