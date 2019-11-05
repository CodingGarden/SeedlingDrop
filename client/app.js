const target = document.querySelector('.target');
const leaderBoard = document.querySelector('.leader-board');

let drops = [];
const currentUsers = {};
let highScores = [];

function createDropElement(url, username, isAvatar = false) {
  const div = document.createElement('div');
  div.className = 'drop';
  div.innerHTML = `
  <h4 class="username">${username}</h4>
  <img class="chute" src="images/parachute.png" alt="">
  <div class="user-image">
    <img class="${isAvatar ? 'avatar' : ''}" src="${url || 'images/seed.png'}" />
  </div>`;
  return div;
}

function doDrop({ username, url, isAvatar = false }) {
  currentUsers[username] = true;
  const element = createDropElement(url, username, isAvatar);
  const drop = {
    username,
    element,
    location: {
      x: window.innerWidth * Math.random(),
      y: -200,
    },
    velocity: {
      x: Math.random() * (Math.random() > 0.5 ? -1 : 1) * 10,
      y: 2 + Math.random() * 5
    }
  };
  drops.push(drop);
  document.body.appendChild(element);
  updateDropPosition(drop);
}

function updateDropPosition(drop) {
  if (drop.landed) return;
  drop.element.style.top = drop.location.y + 'px';
  drop.element.style.left = (drop.location.x - (drop.element.clientWidth / 2)) + 'px';
}

function update() {
  const targetHalfWidth = target.clientWidth / 2;
  drops.forEach(drop => {
    if (drop.landed) return;

    drop.location.x += drop.velocity.x;
    drop.location.y += drop.velocity.y;
    const halfWidth = drop.element.clientWidth / 2;
    if (drop.location.x + halfWidth >= window.innerWidth) {
      drop.velocity.x = -Math.abs(drop.velocity.x);
    } else if (drop.location.x - halfWidth < 0) {
      drop.velocity.x = Math.abs(drop.velocity.x);
    }

    if (drop.location.y + drop.element.clientHeight >= window.innerHeight) {
      drop.velocity.y = 0;
      drop.velocity.x = 0;
      drop.location.y = window.innerHeight - drop.element.clientHeight;
      drop.landed = true;
      drop.element.classList.add('landed');
      const { x } = drop.location;
      const diff = window.innerWidth / 2 - x;
      const score = Math.abs(diff);
      if (score <= targetHalfWidth) {
        const finalScore = (1 - (score / targetHalfWidth)) * 100;
        leaderBoard.style.display = 'block';
        const existingHighScore = highScores.find(h => h.username === drop.username);
        if (existingHighScore) {
          if (finalScore > +existingHighScore.score) {
            existingHighScore.score = finalScore.toFixed(2);
          }
        } else {
          highScores.push({
            username: drop.username,
            score: finalScore.toFixed(2)
          });
        }
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 5);
        renderLeaderBoard();
        addSeedling(x, finalScore, drop.username);
        currentUsers[drop.username] = false;
        drop.element.classList.add('seedling-target');
      } else {
        drop.element.classList.add('no-target');
      }
      setTimeout(() => {
        currentUsers[drop.username] = false;
        document.body.removeChild(drop.element);
      }, 90000);
      drops = drops.filter(d => d != drop);
    }
  });
}

function addSeedling(x, score, username) {
  const container = document.createElement('div');
  container.className = 'seedling-container initial';
  const name = document.createElement('h4');
  name.className = 'username seedling-target';
  name.style.fontSize = (score / 100) * 2.5 + 'rem';
  name.textContent = username;
  const seedling = document.createElement('img');
  seedling.className = 'seedling';
  seedling.src = 'images/seedling.png';
  seedling.style.height = (score * 1.5) + 'px';
  container.appendChild(name);
  container.appendChild(seedling);
  document.body.appendChild(container);
  container.style.left = x + 'px';
  container.style.top = (window.innerHeight - container.clientHeight) + 'px';
}

function renderLeaderBoard() {
  const scores = leaderBoard.querySelector('.scores');
  scores.innerHTML = highScores.reduce((html, { score, username }) => {
    return html + `<p>${score} - ${username}</p>`;
  }, '');
}

function draw() {
  drops.forEach(updateDropPosition);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();

const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true
  },
  channels: [ 'codinggarden' ]
});

for (let i = 0; i < 10; i++) {
  doDrop({ username: 'CJ' });
}

let hideLeaderBoardTimeout = setTimeout(() => {
  leaderBoard.style.display = 'none';
}, 90000);

client.connect();

client.on('message', (channel, { emotes, username, 'display-name': displayName }, message) => {
  if (message.startsWith('!drop')) {
    const name = displayName || username;
    if (currentUsers[name]) return;
    clearTimeout(hideLeaderBoardTimeout);
    hideLeaderBoardTimeout = setTimeout(() => {
      leaderBoard.style.display = 'none';
    }, 90000);
    const args = message.split(' ');
    args.shift();
    // const url = args.length ?  args[0].trim() : '';
    if (emotes) {
      const emoteIds = Object.keys(emotes);
      const emote = emoteIds[Math.floor(Math.random() * emoteIds.length)];
      doDrop({
        url: `https://static-cdn.jtvnw.net/emoticons/v1/${emote}/2.0`,
        username: name,
      });
    } else {
      doDrop({
        username: name,
      });
    }
  }
});
		

