const teams = [
  "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets",
  "Chicago Bulls", "Cleveland Cavaliers", "Dallas Mavericks", "Denver Nuggets",
  "Detroit Pistons", "Golden State Warriors", "Houston Rockets", "Indiana Pacers",
  "LA Clippers", "Los Angeles Lakers", "Memphis Grizzlies", "Miami Heat",
  "Milwaukee Bucks", "Minnesota Timberwolves", "New Orleans Pelicans", "New York Knicks",
  "Oklahoma City Thunder", "Orlando Magic", "Philadelphia 76ers", "Phoenix Suns",
  "Portland Trail Blazers", "Sacramento Kings", "San Antonio Spurs", "Toronto Raptors",
  "Utah Jazz", "Washington Wizards"
];

let teamOrder = [...teams];
let dragIndex = null;

function renderTeams() {
  const list = document.getElementById('teamList');
  list.innerHTML = '';
  teamOrder.forEach((team, idx) => {
    const li = document.createElement('li');
    li.textContent = team;
    li.draggable = true;
    li.dataset.index = idx;
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);
    list.appendChild(li);
  });
}
function handleDragStart(e) {
  dragIndex = +this.dataset.index;
}
function handleDragOver(e) {
  e.preventDefault();
}
function handleDrop(e) {
  const dropIndex = +this.dataset.index;
  [teamOrder[dragIndex], teamOrder[dropIndex]] = [teamOrder[dropIndex], teamOrder[dragIndex]];
  renderTeams();
}

document.getElementById('saveSeason').addEventListener('click', () => {
  localStorage.setItem('seasonOrder', JSON.stringify(teamOrder));
  alert('Regular season ranking saved!');
});

function loadSeason() {
  const saved = localStorage.getItem('seasonOrder');
  if (saved) {
    try {
      teamOrder = JSON.parse(saved);
    } catch {}
  }
  renderTeams();
}

// ----- Playoffs Bracket -----
const r1Pairs = [
  ["Bucks", "Heat"],
  ["Celtics", "Hawks"],
  ["76ers", "Nets"],
  ["Cavaliers", "Knicks"],
  ["Nuggets", "Timberwolves"],
  ["Grizzlies", "Lakers"],
  ["Kings", "Warriors"],
  ["Suns", "Clippers"]
];

let r1Winners = Array(r1Pairs.length).fill(null);
let r2Winners = Array(r1Pairs.length/2).fill(null);
let r3Winners = Array(r1Pairs.length/4).fill(null);
let champion = null;

function createRound(roundNum, pairs) {
  const container = document.getElementById(`round${roundNum}`);
  container.innerHTML = `<h3>${container.querySelector('h3').textContent}</h3>`; // keep heading
  pairs.forEach((pair, idx) => {
    const match = document.createElement('div');
    match.className = 'match';
    pair.forEach(team => {
      const btn = document.createElement('button');
      btn.textContent = team || 'TBD';
      btn.disabled = !team;
      btn.addEventListener('click', () => handleWin(roundNum, idx, team));
      match.appendChild(btn);
    });
    container.appendChild(match);
  });
}

function handleWin(roundNum, matchIndex, team) {
  if (roundNum === 1) {
    r1Winners[matchIndex] = team;
    if (r1Winners.every(Boolean)) {
      const next = [
        [r1Winners[0], r1Winners[1]],
        [r1Winners[2], r1Winners[3]],
        [r1Winners[4], r1Winners[5]],
        [r1Winners[6], r1Winners[7]]
      ];
      createRound(2, next);
    }
  } else if (roundNum === 2) {
    r2Winners[matchIndex] = team;
    if (r2Winners.every(Boolean)) {
      const next = [
        [r2Winners[0], r2Winners[1]],
        [r2Winners[2], r2Winners[3]]
      ];
      createRound(3, next);
    }
  } else if (roundNum === 3) {
    r3Winners[matchIndex] = team;
    if (r3Winners.every(Boolean)) {
      const next = [[r3Winners[0], r3Winners[1]]];
      createRound(4, next);
    }
  } else if (roundNum === 4) {
    champion = team;
    alert(`Champion: ${champion}`);
  }
}

function init() {
  loadSeason();
  createRound(1, r1Pairs);
}

document.addEventListener('DOMContentLoaded', init);
