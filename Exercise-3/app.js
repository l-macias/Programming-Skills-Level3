/* 
3. Real State Rent System 
En resumen:
Inmobiliaria tiene 5 casas para alquilar.
Las casas tienen: size, bedrooms qty, bathrooms qty, location (la invento y le pongo porcentajes)
El precio de la casa se calcula en base a estos factores.

*/
//Declare some Variable
//DOM
const container = document.querySelector('.container');
//This time i use Classes and methods to create the houses and manipulate it.
class Home {
  constructor(name, squareMeters, bedrooms, bathrooms, location) {
    this.name = name;
    this.squareMeters = squareMeters;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.location = this.checkLocation(location);
    this.totalCost = this.getRentValue();
  }
  //Method to check if the house is in a correct location.
  checkLocation(location) {
    const validLocations = ['Manchester', 'London', 'Madrid'];
    if (validLocations.includes(location)) {
      return location;
    } else {
      throw new Error(
        'Invalid location. Please choose from: Manchester, London, or Madrid.'
      );
    }
  }
  //Method to get value considering commodities and location.
  getRentValue() {
    const bedroomCost = this.bedrooms * 40;
    const bathroomCost = this.bathrooms * 30;
    const squareMeterCost = this.squareMeters * 90;
    const commoditiesCost = bedroomCost + bathroomCost + squareMeterCost;
    const totalCost =
      this.location == 'Manchester'
        ? commoditiesCost * 1.2
        : this.location == 'Madrid'
        ? commoditiesCost * 1.1
        : commoditiesCost * 1.05;
    return totalCost;
  }
}

//Instantiating of Class Home
const firstHome = new Home('First home', 200, 5, 3, 'Manchester');
const secondHome = new Home('Second home', 150, 2, 2, 'London');
const thirdHome = new Home('Third home', 100, 4, 1, 'Madrid');
const fourthHome = new Home('Fourth home', 120, 1, 2, 'Manchester');
const fifthHome = new Home('Fifth home', 80, 1, 1, 'London');

//Function to draw home in DOM
const createHome = (home) => {
  const div = document.createElement('div');
  div.classList.add('home');
  div.innerHTML = `
      <h2>${home.name}</h2>
      <p>House Size: ${home.squareMeters} m<sup>2</sup></p>
      <p>${home.bedrooms} bedrooms</p>
      <p>${home.bathrooms} bathrooms</p>
      <p>Locations:${home.location}</p>
      <p>Total Cost: $ ${home.totalCost}</p>`;
  return div;
};
//Iterating through each homes, create a div for each one and append it to container
[firstHome, secondHome, thirdHome, fourthHome, fifthHome].forEach((home) => {
  const div = createHome(home);
  container.appendChild(div);
});
