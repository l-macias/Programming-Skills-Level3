const planes = [];

//Planes data
const planesData = {
  planes: [
    {
      name: 'Wayne Rooney',
      materialQuality: 'AAA',
      economy: {
        seats: 200,
        pricePerSeat: 400,
      },
      vip: {
        seats: 70,
        pricePerSeat: 1000,
      },
      area: 90,
      securitySystem: 'AAA',
      speedLevel: 'AAA',
    },
    {
      name: 'Eric Cantona',
      materialQuality: 'AAA',
      economy: {
        seats: 150,
        pricePerSeat: 400,
      },
      vip: {
        seats: 80,
        pricePerSeat: 1200,
      },
      area: 110,
      securitySystem: 'AAA',
      speedLevel: 'AA',
    },
    {
      name: 'Bobby Charlton',
      materialQuality: 'AA',
      economy: {
        seats: 100,
        pricePerSeat: 300,
      },
      vip: {
        seats: 40,
        pricePerSeat: 1000,
      },
      area: 120,
      securitySystem: 'AA',
      speedLevel: 'A',
    },
  ],
};

//Store data in array
planes.push(...planesData.planes);

//Main Function to calculate plane prices
const calculatePrice = (plane) => {
  let totalPrice = 0;
  //Create a static price per meter to calculate later the total area price
  const pricePerMeter = 5000;
  //Retrieve data from an object destructuring it.
  const {
    name,
    materialQuality,
    economy,
    vip,
    securitySystem,
    speedLevel,
    area,
  } = plane;

  //Calculate seats total price
  const economySeatsPrice = economy.seats * economy.pricePerSeat;
  const vipSeatsPrice = vip.seats * vip.pricePerSeat;

  //Calculate prices of quality, security and speed level based on the quality
  const qualityPrice =
    materialQuality === 'AAA'
      ? 60000
      : materialQuality === 'AA'
      ? 54000
      : 48000;

  const securityPrice =
    securitySystem === 'AAA' ? 75000 : securitySystem === 'AA' ? 68000 : 59000;

  const speedLevelPrice =
    speedLevel === 'AAA' ? 89000 : speedLevel === 'AA' ? 78000 : 70000;

  //Calculate area price
  const areaPrice = area * pricePerMeter;

  //Calculate total price
  totalPrice =
    economySeatsPrice +
    vipSeatsPrice +
    qualityPrice +
    securityPrice +
    speedLevelPrice +
    areaPrice;
  //Store all prices in an object.
  const planePrice = {
    name,
    vipSeatsPrice,
    economySeatsPrice,
    securityPrice,
    qualityPrice,
    speedLevelPrice,
    areaPrice,
    totalPrice,
  };
  //Show results in console
  console.log(planePrice);
  return planePrice;
};

//Loop through the planes array show prices of each ones.
planes.forEach((plane) => {
  calculatePrice(plane);
});
