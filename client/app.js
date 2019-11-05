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
    <img class="${isAvatar ? 'avatar' : ''}" src="${url}" />
  </div>`;
  return div;
}

function doDrop({ username, url, isAvatar = false }) {
  console.log(username, url);
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
      const score = Math.abs(window.innerWidth / 2 - x);
      if (score <= targetHalfWidth) {
        const finalScore = (1 - (score / targetHalfWidth)) * 100;
        leaderBoard.style.display = 'block';
        highScores.push({
          username: drop.username,
          score: finalScore.toFixed(2)
        });
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 5);
        renderLeaderBoard();
      }
      drops = drops.filter(d => d != drop);
      setTimeout(() => {
        currentUsers[drop.username] = false;
        document.body.removeChild(drop.element);
      }, 1000);
    }
  });
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

client.connect();

client.on('message', (channel, { emotes, username, 'display-name': displayName }, message) => {
  if (message.startsWith('!drop')) {
    const name = displayName || username;
    if (currentUsers[name]) return;
    const args = message.split(' ');
    args.shift();
    const url = args.length ?  args[0].trim() : '';
    if (emotes) {
      const emoteIds = Object.keys(emotes);
      const emote = emoteIds[Math.floor(Math.random() * emoteIds.length)];
      doDrop({
        url: `https://static-cdn.jtvnw.net/emoticons/v1/${emote}/2.0`,
        username: name,
      });
    } else {
      console.log(username, url);
    }
  }
});
		

