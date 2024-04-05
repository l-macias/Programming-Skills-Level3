//Declare variables to global use
let manchesterUnitedPlayers = [];
let selectedMunPlayers = [];
let spursPlayers = [];
let totalSpurs = 0;
let manTotalPoints;

const goalkeeperIndex = 0;
const defendersRange = [1, 2, 3, 4];
const midfieldersRange = [5, 6, 7];
const forwardsRange = [8, 9, 10];

//Some DOM variables
const munPlayersContainer = document.getElementById('mun-players');
const finishBtn = document.getElementById('finish-btn');
const resultContainer = document.getElementById('result-container');

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

//Function to calculate Spurs total points and average
const spursTotalPoints = (lineup) => {
  let totalPointsSpurs = lineup.reduce((acc, player) => {
    return acc + player.points;
  }, 0);
  avgSpurs = parseFloat(totalPointsSpurs / 11).toFixed(2);
  totalSpurs = { totalPointsSpurs, avgSpurs };
};

//Function to create a random Spurs lineup (1-4-3-3)
const randomSpursLineup = () => {
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

//MUN

// Function to display Manchester United players in the DOM
const displayManchesterUnitedPlayers = () => {
  // Clear container to not duplicate.
  munPlayersContainer.innerHTML = '';

  // Iterate  array of players
  for (const position in manchesterUnitedPlayers) {
    // Create a title for the position in DOM
    const positionTitle = document.createElement('h3');
    positionTitle.textContent = position;
    munPlayersContainer.appendChild(positionTitle);

    // Iterate array and display players in DOM
    manchesterUnitedPlayers[position].forEach((player) => {
      const playerItem = document.createElement('li');
      playerItem.innerHTML = `<b>${player.name}</b> - Points: ${player.points}`;
      playerItem.setAttribute('data-position', position);
      playerItem.setAttribute('data-name', player.name);
      playerItem.setAttribute('data-points', player.points);
      playerItem.classList.add('player-item');
      playerItem.addEventListener('click', handlePlayerSelection); // Listen click on player
      munPlayersContainer.appendChild(playerItem);
    });
  }
};

// Function to handle player selection (click)
const handlePlayerSelection = (event) => {
  const playerName = event.currentTarget.getAttribute('data-name');
  const playerPosition = event.currentTarget.getAttribute('data-position');
  const playerPoints = event.currentTarget.getAttribute('data-points');
  console.log(playerPosition);
  // Check if the player is already selected
  const isAlreadySelected = selectedMunPlayers.some(
    (player) => player.name === playerName && player.position === playerPosition
  );

  // Count the number of players already selected in each position
  const goalkeepersSelected = selectedMunPlayers.filter(
    (player) => player.position === 'Goalkeepers'
  ).length;
  const defendersSelected = selectedMunPlayers.filter(
    (player) => player.position === 'Defenders'
  ).length;
  const midfieldersSelected = selectedMunPlayers.filter(
    (player) => player.position === 'Midfielders'
  ).length;
  const forwardsSelected = selectedMunPlayers.filter(
    (player) => player.position === 'Forwards'
  ).length;

  // Check the max allowed players for each position
  const maxGoalkeepers = 1;
  const maxDefenders = 4;
  const maxMidfielders = 3;
  const maxForwards = 3;

  // Add the player if not already selected and not exceeding the max allowed players for the position
  if (
    !isAlreadySelected &&
    (playerPosition !== 'Goalkeepers' ||
      goalkeepersSelected < maxGoalkeepers) &&
    (playerPosition !== 'Defenders' || defendersSelected < maxDefenders) &&
    (playerPosition !== 'Midfielders' ||
      midfieldersSelected < maxMidfielders) &&
    (playerPosition !== 'Forwards' || forwardsSelected < maxForwards)
  ) {
    //Push player to lineup with all data we need
    selectedMunPlayers.push({
      name: playerName,
      position: playerPosition,
      points: parseInt(playerPoints),
    });
    event.currentTarget.classList.add('selected');
  } else {
    // If click again, we remove the player from the selected list
    selectedMunPlayers = selectedMunPlayers.filter(
      (player) =>
        !(player.name === playerName && player.position === playerPosition)
    );
    event.currentTarget.classList.remove('selected');
  }
  //If lineup has 11 players, we show the finish button, else, we hide it.
  if (selectedMunPlayers.length === 11) {
    finishBtn.classList.remove('hidden');
    finishBtn.classList.add('show');
  } else {
    finishBtn.classList.add('hidden');
    finishBtn.classList.remove('show');
  }
};

//Function to generate total points from manchester united lineup
const getManTotalPoints = () => {
  return (manTotalPoints = selectedMunPlayers.reduce(
    (acc, player) => acc + player.points,
    0
  ));
};

//Initial Function with fetch json's and invoke functions
const init = async () => {
  //Fetching Manchester United Players from a JSON file.
  await fetchJson('./mun.json')
    .then((data) => {
      if (data) {
        manchesterUnitedPlayers = data[0];
        console.log(manchesterUnitedPlayers);
        displayManchesterUnitedPlayers();
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
  //Invoke spurs functions
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
//Function to add points to Spurs and average in DOM
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
//Function to get Total MAN points
const getTotalPoints = () => {
  const manTotalPoints = getManTotalPoints();
  const spursTotalPoints = totalSpurs.totalPointsSpurs;
  return { manTotalPoints, spursTotalPoints };
};
// Function  to check the winner comparing points of both teams
const checkWinner = (manTotalPoints, spursTotalPoints) => {
  let winner = '';
  if (manTotalPoints > spursTotalPoints) {
    winner = 'WE WOONNNNNNNNNNNNN!!!!!!!';
  } else if (manTotalPoints < spursTotalPoints) {
    winner = 'Spurs Wins';
  } else {
    winner = 'Draw';
  }
  resultContainer.innerHTML = `
  <p>Puntaje de Manchester United: ${manTotalPoints}</p>
  <p>Puntaje de Tottenham Spurs: ${spursTotalPoints}</p>
  <p>${winner}</p>
`;
};
//Listen finish button and invoke check Winner
finishBtn.addEventListener('click', () => {
  const { manTotalPoints, spursTotalPoints } = getTotalPoints();
  checkWinner(manTotalPoints, spursTotalPoints);
});

//Start the app
init();
