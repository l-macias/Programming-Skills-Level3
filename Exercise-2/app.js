/* 
2. Amazon Software Engineer 

Amazon has hired you as a software engineer. Your first task is to create a system that allows calculating the price of shipping based on distance. Fulfill the following requirements:
Amazon has one branch in each state of the USA.
Research the approximate distance between each pair of states.
The price is $50 USD per kilometer.
The minimum number of packages to transport is 100, and the maximum is 500.
If the number of packages exceeds 200, a larger vehicle should be recommended, with a price of $60 USD per kilometer.
Based on the distance, the system should calculate an estimated delivery time.
*/
//Declare some Variables
let statesNames;
let distance;
//DOM
const sourceSelect = document.getElementById('source-select');
const destinationSelect = document.getElementById('destination-select');
const calculateBtn = document.getElementById('calculate-btn');
const resultContainer = document.getElementById('result-container');
const packageCount = document.getElementById('package-count');

let states = [];
//fetch file states.json and store in the array states
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
//Function to calculate distance between coords (Thanks Gemini)
function HaversineCalc(lat1, lon1, lat2, lon2) {
  const earthRadius = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

const init = async () => {
  try {
    //Fetching States and Coords from a JSON file.
    const data = await fetchJson('./states.json');
    if (data) {
      states = data;
      //Create options for select with source and destinations
      statesNames = Object.keys(states);
      getStatesNames(statesNames, sourceSelect);
      //Listen change on select to filter destination to not repeat with source
      sourceSelect.addEventListener('change', () => {
        destinationSelect.innerHTML = '';
        const selectedSourceState = sourceSelect.value;
        const remainingStates = statesNames.filter(
          (state) => state !== selectedSourceState
        );
        getStatesNames(remainingStates, destinationSelect);
      });

      calculateBtn.addEventListener('click', (e) => {
        e.preventDefault();
        getCoords();
        getResults(distance, packageCount);
      });
    }
  } catch (error) {
    console.log(error);
  }
};

//function to get coordenates from selected source and destination
const getCoords = () => {
  let sourceState = sourceSelect.value;
  let destinationState = destinationSelect.value;
  distance = HaversineCalc(
    states[sourceState][0],
    states[sourceState][1],
    states[destinationState][0],
    states[destinationState][1]
  ).toFixed(0);

  return distance;
};

//function to results
const getResults = (distance, packageCount) => {
  let price = 0;
  let packages = Number(packageCount.value);
  if (packages < 100 || packages > 500) {
    alert('Min packages are 100, and Max 500');
  } else {
    packages <= 200 ? (price = 50) : (price = 60);
    let totalValue = distance * price;
    let avgSpeed = 70;
    let estimatedTime = (distance / avgSpeed).toFixed(0);
    resultContainer.innerHTML = `
  <h3>Result</h3>
    <p>The distance between ${sourceSelect.value} and ${destinationSelect.value} is ${distance} km.</p>
    <p>The Estimated Time is: ${estimatedTime} hours.</p>
    <p>Total Shipping cost: $ ${totalValue} </p>
  `;
  }
};

//function to create options to select
const getStatesNames = (states, select) => {
  states.forEach((state) => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    select.appendChild(option);
  });
};

init();
