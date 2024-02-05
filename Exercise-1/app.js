//Declare variables to global use
let manchesterUnitedPlayers = [];
let spursPlayers = [];
let totalSpurs = 0;
let munLineup = [];
let spursLineup = [];

//Function to fetch JSON files
const fetchJson = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data) {
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};
//Function to calculate Spurs total points
const spursTotalPoints = (lineup) => {
  let totalPointsSpurs = lineup.reduce((acc, player) => {
    return acc + player.points;
  }, 0);
  avgSpurs = parseFloat(totalPointsSpurs / 11).toFixed(2);
  totalSpurs = { totalPointsSpurs, avgSpurs };
};
//Function to create a random Spurs lineup (1-4-3-3)
const randomSpursLineup = () => {
  if (!spursPlayers || spursPlayers.length === 0) {
    console.log('No hay datos de jugadores disponibles.');
    return;
  }
  const goalkeeper = spursPlayers.Goalkeepers;
  const defenders = spursPlayers.Defenders;
  const midfielders = spursPlayers.Midfielders;
  const forwards = spursPlayers.Forwards;

  //Only one goalkeeper
  const randomGoalkeeper =
    goalkeeper[Math.floor(Math.random() * goalkeeper.length)];
  const randomDefenders = [];
  const randomMidfielders = [];
  const randomForwards = [];
  //4 Defenders. We use splice to dont duplicate players in lineup
  for (let i = 0; i < 4; i++) {
    const randomDefender =
      defenders[Math.floor(Math.random() * defenders.length)];
    randomDefenders.push(randomDefender);
    defenders.splice(defenders.indexOf(randomDefender), 1);
  }
  // 3 Midfielders and 3 Forwards, reutilize for in both options. Generate random players on each positions
  // and splice players from each position to avoid duplicate in lineup
  for (let i = 0; i < 3; i++) {
    const randomMidfielder =
      midfielders[Math.floor(Math.random() * midfielders.length)];
    randomMidfielders.push(randomMidfielder);
    midfielders.splice(midfielders.indexOf(randomMidfielder), 1);
    const randomForward = forwards[Math.floor(Math.random() * forwards.length)];
    randomForwards.push(randomForward);
    forwards.splice(forwards.indexOf(randomForward), 1);
  }
  //Create the lineup
  spursLineup = [
    randomGoalkeeper,
    ...randomDefenders,
    ...randomMidfielders,
    ...randomForwards,
  ];
  //Invoke Function to calculate total points from spurs lineup
  spursTotalPoints(spursLineup);
};

//Initial function to handle async data from fetch
const init = async () => {
  //Fetching Manchester United Players from a JSON file.
  await fetchJson('./spurs.json')
    .then((data) => {
      if (data) {
        manchesterUnitedPlayers = data[0];
        console.log(manchesterUnitedPlayers);
      }
    })
    .catch((error) => console.log(error));

  //Fetching Tottenham Spurs Players from a JSON file.
  await fetchJson('./spurs.json')
    .then((data) => {
      if (data) {
        spursPlayers = data[0];
        console.log(spursPlayers);
      }
    })
    .catch((error) => console.log(error));
  randomSpursLineup();
  obtainPosition(spursLineup);
  addTotalSpursPoints();
};

//Function to draw Spurs lineup in DOM
const addPlayerToList = (player, listId) => {
  const list = document.getElementById(listId);
  const listItem = document.createElement('li');
  listItem.innerHTML = `<b>${player.name}</b>  <br>Points: <b>${player.points}</b>`;
  list.appendChild(listItem);
};

const addTotalSpursPoints = () => {
  const totalSpursPoints = document.getElementById('totalSpursPoints');
  totalSpursPoints.textContent = `Total Points: ${totalSpurs.totalPointsSpurs}`;
  const averageSpursPoints = document.getElementById('averageSpursPoints');
  averageSpursPoints.textContent = `Average Points: ${totalSpurs.avgSpurs}`;
};
//Function to obtain position from players
const obtainPosition = (lineup) => {
  lineup.forEach((player, index) => {
    if (index === goalkeeperIndex) {
      addPlayerToList(player, 'goalkeeperList');
    } else if (defendersRange.includes(index)) {
      addPlayerToList(player, 'defendersList');
    } else if (midfieldersRange.includes(index)) {
      addPlayerToList(player, 'midfieldersList');
    } else if (forwardsRange.includes(index)) {
      addPlayerToList(player, 'forwardsList');
    }
  });
};

//Get index to get position
const goalkeeperIndex = 0;
const defendersRange = [1, 2, 3, 4];
const midfieldersRange = [5, 6, 7];
const forwardsRange = [8, 9, 10];

//Start the app
init();
