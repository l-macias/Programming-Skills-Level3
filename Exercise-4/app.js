//Some Variables
let stocks;
const cart = [];

//DOM Variables
const form = document.getElementById('jerseyForm');
const genderSelect = document.getElementById('gender');
const sleeveTypeSelect = document.getElementById('sleeveType');
const kitSelect = document.getElementById('kit');
const sizeSelect = document.getElementById('size');
const quantityInput = document.getElementById('quantity');
const addToCartBtn = document.getElementById('addToCartBtn');
const personalize = document.getElementById('personalize');

// Fetch function
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
//Fetch data and populate first select (Gender)
const getStocks = async () => {
  const data = await fetchJson('./clothes.json');
  if (data) {
    stocks = data;
    populateGenderSelect();
    sleeveTypeSelect.disabled = false;
  }
};

// FUNCTIONS TO POPULATE SELECTS WITH DATA FROM STOCKS ARRAY

// Function to populate Gender Select
const populateGenderSelect = () => {
  stocks.jerseys.categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    genderSelect.appendChild(option);
  });
};
// Function to populate Sleeves Type Select
const populateSleeveTypeSelect = () => {
  const sleeveTypes = Object.keys(stocks.jerseys.prices.standard);
  console.log(sleeveTypes);
  sleeveTypes.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    //Spacing the words and Capitalizing the first letter of the type.
    let spaciedType = type.replace('Sleeve', ' Sleeve');
    option.textContent =
      spaciedType.charAt(0).toUpperCase() + spaciedType.slice(1);
    sleeveTypeSelect.appendChild(option);
  });
  kitSelect.disabled = false;
};

// Function to populate Kit Select based on selected sleeve type
const populateKitSelect = () => {
  const kits = Object.keys(stocks.jerseys.stock[stocks.jerseys.categories[0]]);
  kits.forEach((kit) => {
    const option = document.createElement('option');
    option.value = kit;
    option.textContent = kit.charAt(0).toUpperCase() + kit.slice(1);
    kitSelect.appendChild(option);
  });
  sizeSelect.disabled = false;
};

// Function to populate Size Select based on selected kit
const populateSizeSelect = () => {
  const sizes = stocks.jerseys.sizes;
  sizes.forEach((size) => {
    const option = document.createElement('option');
    option.value = size;
    option.textContent = size;
    sizeSelect.appendChild(option);
  });
};

//Function to check stock and put max quantity in input
const checkStock = () => {
  const gender = document.getElementById('gender').value;
  const sleeveType = sleeveTypeSelect.value;
  const kit = kitSelect.value;
  const size = sizeSelect.value;
  const stock = stocks.jerseys.stock[gender][kit][sleeveType][size];
  stock == 0
    ? alert('No stock, please select another size or kit')
    : //Set max value
      (quantityInput.max = stock);
  quantityInput.min = 1;
  //Validate max stock in input
  quantityInput.oninput = function () {
    const value = parseInt(this.value);

    if (value > stock) {
      this.value = stock;
    } else if (!value || value < 1) {
      this.value = 1;
    }
  };
  quantityInput.disabled = false;
  addToCartBtn.disabled = false;
  console.log(stock);
};

// Events listeners (Selects)
genderSelect.addEventListener('change', () => {
  populateSleeveTypeSelect();
});

sleeveTypeSelect.addEventListener('change', () => {
  populateKitSelect();
});

kitSelect.addEventListener('change', () => {
  populateSizeSelect();
});

sizeSelect.addEventListener('change', () => {
  checkStock();
});

personalize.addEventListener('change', () => {
  if (personalize.checked) {
    document.getElementById('playerNumber').disabled = false;
  } else {
    document.getElementById('playerNumber').disabled = true;
  }
});

//Event listener for Add to Cart Button
addToCartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  // Get data from form
  const gender = genderSelect.value;
  const sleeveType = sleeveTypeSelect.value;
  const kit = kitSelect.value;
  const size = sizeSelect.value;
  const quantity = parseInt(quantityInput.value);
  console.log(quantity);
  const personalized = personalize.checked;
  const playerNumber = document.getElementById('playerNumber').value;
  //Update Stock
  stocks.jerseys.stock[gender][kit][sleeveType][size] -= quantity;

  // Verify if valid article is selected
  if (gender && sleeveType && kit && size && quantity > 0) {
    //Get Price and total price
    console.log(stocks.jerseys.prices.standard[sleeveType][gender]);
    //Check if it is Children or Standard (men or woman)
    let price =
      gender == 'Children'
        ? stocks.jerseys.prices.children[sleeveType]
        : stocks.jerseys.prices.standard[sleeveType][gender];
    //Check if it is personalized
    let personlizedPrice = 0;
    if (personalized === true) {
      personlizedPrice = 25;
    }
    let totalJerseyPrice = parseInt(price * quantity);
    let totalPersonalizedPrice = personlizedPrice * quantity;
    let totalPrice = totalJerseyPrice + totalPersonalizedPrice;

    // Create an object with data to push in cart array
    const selectedItem = {
      gender,
      sleeveType,
      kit,
      size,
      quantity,
      playerNumber,
      totalJerseyPrice,
      totalPersonalizedPrice,
      totalPrice,
    };
    cart.push(selectedItem);
    form.reset();
    // Disable all forms selects
    quantityInput.disabled = true;
    addToCartBtn.disabled = true;
    checkoutBtn.disabled = false;
    //Clean selects
    genderSelect.innerHTML = '';
    sleeveTypeSelect.innerHTML = '';
    kitSelect.innerHTML = '';
    sizeSelect.innerHTML = '';
    populateGenderSelect();
  }
});

const checkoutBtn = document.getElementById('checkoutBtn');
checkoutBtn.addEventListener('click', (e) => {
  e.preventDefault();
  createCart();
});

let total = 0;
//Function with reduce from array cart to calculate total amount
const totalAmount = () => {
  total = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  return total;
};

// Function to create a cart with all elements
const createCart = () => {
  addToCartBtn.disabled = true;
  checkoutBtn.disabled = true;
  const cartContainer = document.getElementById('cartContainer');
  const cartTable = document.createElement('table');
  cartTable.className = 'table table-striped';
  const cartHeader = document.createElement('thead');
  const cartHeaderRow = document.createElement('tr');
  const cartHeaderCell1 = document.createElement('th');
  cartHeaderCell1.textContent = 'Gender';
  const cartHeaderCell2 = document.createElement('th');
  cartHeaderCell2.textContent = 'Sleeve Type';
  const cartHeaderCell3 = document.createElement('th');
  cartHeaderCell3.textContent = 'Kit';
  const cartHeaderCell4 = document.createElement('th');
  cartHeaderCell4.textContent = 'Size';
  const cartHeaderCell5 = document.createElement('th');
  cartHeaderCell5.textContent = 'Quantity';
  const cartHeaderCell6 = document.createElement('th');
  cartHeaderCell6.textContent = 'Player Number';
  const cartHeaderCell7 = document.createElement('th');
  cartHeaderCell7.textContent = 'Total Price';
  cartHeaderCell7.className = 'text-end';
  cartHeaderRow.appendChild(cartHeaderCell1);
  cartHeaderRow.appendChild(cartHeaderCell2);
  cartHeaderRow.appendChild(cartHeaderCell3);
  cartHeaderRow.appendChild(cartHeaderCell4);
  cartHeaderRow.appendChild(cartHeaderCell5);
  cartHeaderRow.appendChild(cartHeaderCell6);
  cartHeaderRow.appendChild(cartHeaderCell7);
  cartHeader.appendChild(cartHeaderRow);
  cartTable.appendChild(cartHeader);
  const cartBody = document.createElement('tbody');
  cart.forEach((item) => {
    const cartBodyRow = document.createElement('tr');
    const cartBodyCell1 = document.createElement('td');
    cartBodyCell1.textContent = item.gender;
    const cartBodyCell2 = document.createElement('td');
    cartBodyCell2.textContent = item.sleeveType;
    const cartBodyCell3 = document.createElement('td');
    cartBodyCell3.textContent = item.kit;
    const cartBodyCell4 = document.createElement('td');
    cartBodyCell4.textContent = item.size;
    const cartBodyCell5 = document.createElement('td');
    cartBodyCell5.textContent = item.quantity;
    const cartBodyCell6 = document.createElement('td');
    cartBodyCell6.textContent = item.playerNumber;
    const cartBodyCell7 = document.createElement('td');
    cartBodyCell7.textContent = item.totalPrice;
    cartBodyCell7.className = 'text-end';
    cartBodyRow.appendChild(cartBodyCell1);
    cartBodyRow.appendChild(cartBodyCell2);
    cartBodyRow.appendChild(cartBodyCell3);
    cartBodyRow.appendChild(cartBodyCell4);
    cartBodyRow.appendChild(cartBodyCell5);
    cartBodyRow.appendChild(cartBodyCell6);
    cartBodyRow.appendChild(cartBodyCell7);
    cartBody.appendChild(cartBodyRow);
    cartTable.appendChild(cartBody);
    cartContainer.appendChild(cartTable);
  });

  const totalAmountContainer = document.createElement('div');
  totalAmountContainer.className = 'text-end';
  const totalAmountText = document.createElement('h3');
  totalAmountText.textContent = `Total Amount: ${totalAmount()}`;
  totalAmountContainer.appendChild(totalAmountText);
  cartContainer.appendChild(totalAmountContainer);
};

// Initialize
getStocks();
