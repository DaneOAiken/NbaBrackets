// Split teams by conference
const eastTeams = [
  "Atlanta Hawks", "Boston Celtics", "Brooklyn Nets", "Charlotte Hornets",
  "Chicago Bulls", "Cleveland Cavaliers", "Detroit Pistons", "Indiana Pacers",
  "Miami Heat", "Milwaukee Bucks", "New York Knicks", "Orlando Magic",
  "Philadelphia 76ers", "Toronto Raptors", "Washington Wizards"
];

const westTeams = [
  "Dallas Mavericks", "Denver Nuggets", "Golden State Warriors", "Houston Rockets",
  "LA Clippers", "Los Angeles Lakers", "Memphis Grizzlies", "Minnesota Timberwolves",
  "New Orleans Pelicans", "Oklahoma City Thunder", "Phoenix Suns", "Portland Trail Blazers",
  "Sacramento Kings", "San Antonio Spurs", "Utah Jazz"
];

let eastOrder = [...eastTeams];
let westOrder = [...westTeams];

let dragIndex = null;
let dragList = null;

function renderConference(listId, teamsArray) {
  const list = document.getElementById(listId);
  list.innerHTML = '';
  teamsArray.forEach((team, idx) => {
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

function renderAll() {
  renderConference('eastList', eastOrder);
  renderConference('westList', westOrder);
}

function handleDragStart() {
  dragIndex = +this.dataset.index;
  dragList = this.parentElement.id;
}

function handleDragOver(e) {
  e.preventDefault();
}

function handleDrop() {
  const dropIndex = +this.dataset.index;
  const listId = this.parentElement.id;
  if (listId !== dragList) return; // only reorder within same list
  const arr = listId === 'eastList' ? eastOrder : westOrder;
  [arr[dragIndex], arr[dropIndex]] = [arr[dropIndex], arr[dragIndex]];
  renderAll();
}

function loadRankings() {
  const eastSaved = localStorage.getItem('eastOrder');
  const westSaved = localStorage.getItem('westOrder');
  if (eastSaved) {
    try { eastOrder = JSON.parse(eastSaved); } catch {}
  }
  if (westSaved) {
    try { westOrder = JSON.parse(westSaved); } catch {}
  }
  renderAll();
}

document.getElementById('saveSeason').addEventListener('click', () => {
  localStorage.setItem('eastOrder', JSON.stringify(eastOrder));
  localStorage.setItem('westOrder', JSON.stringify(westOrder));
  alert('Rankings saved!');
});

document.addEventListener('DOMContentLoaded', loadRankings);
