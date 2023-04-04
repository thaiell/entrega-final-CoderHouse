let stockStorage = JSON.parse(localStorage.getItem("stockStorage")) || [];
let shopCartStorage = JSON.parse(localStorage.getItem("shopCartStorage")) || [];
let cardSection = document.getElementById("sectioncards");

let shopCartMenuBody = document.getElementById("shopCartMenuBody");

let price = document.getElementById("price");

// FUNCIONES ESENCIALES
function cartUpdate(){
    let numShopCart = document.getElementById("numShopCart");
    numShopCart.innerHTML = shopCartStorage.length;
    let totalPrice = shopCartStorage.reduce((acc, product) => acc + product.priceProduct, 0);
    price.innerHTML = `<h5>Precio Total: $${totalPrice}</h5>`;
}

function toPascalCase(frase) { // funcion buscada en google para que quede mas bonito el proyecto, sinceridad ante todo
    return frase.trim().split(' ').map(function(palabra) {
      return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    }).join(' ');
  }

const cards = (array) => {
    array.forEach(product => {
        let div = document.createElement("div");
        div.className = "mycard";
    
        div.innerHTML = `
        <img src="${product.URLimg}" alt="${product.URLDescription}">
        <div class="cardContent">
        <div class="wordCard">
        <h2 class="productNameCard">${product.nameProduct.toUpperCase()}</h2>
        <p class="handmakerName">${product.handmakerName}</p>
        </div>
        <div class="buttonToRight">
        <b class="price">$${product.priceProduct}</b>
        <button id="addToBuy_${product.idProduct}" class="buttonShopCart">Añadir Al Carrito</button>
        </div>
        </div>
        `
        cardSection.append(div);
    
        let button = document.getElementById(`addToBuy_${product.idProduct}`);
        button.addEventListener("click", () => addProduct(product.idProduct));    
    })
}// CONSTRUCTOR DE CARDS EN EL DOM

const shopMenu = () => {
    for(product of shopCartStorage){
        addCart(product);
    }
let div = document.createElement(`div`);
div.innerHTML = `
    <button id="buyModal" class="buyBtn">Comprar</button>
`;
menuFooter.appendChild(div);
cartUpdate();
} // CONSTRUCTOR DE CARRITO EN LOCALSTORAGE



// PROCESO DE AGREGADO AL SHOPCART

const addProduct = (id) => {
    let product = stockStorage.find(item => item.idProduct == id);
    let already = shopCartStorage.find(item => item.idProduct == id) || -1;
        // ESTO COMPARA LOS ID, SI COINCIDEN, EL PRODUCTO NO SE AGREGA A EL SHOP CART
  
if(product.idProduct === already.idProduct){
    alert("Producto ya agregado")
} else {
    shopCartStorage.push(product);
    localStorage.setItem("shopCartStorage", JSON.stringify(shopCartStorage));
    addCart(product);
}} 

const addCart = (product) => {
    let div = document.createElement("div");
    div.className = "toBuy";

    div.innerHTML = `
    <div class="cartProductList">
        <div class="leftBlock">
            <img class="imgCartShopList" src="${product.URLimg}" alt="${product.URLDescription}">
            <h3 class="h3CartShopList">${toPascalCase(product.nameProduct)}</h3>
        </div>
        <div class="rightBlock">
        <p>$${product.priceProduct}</p>
        <button id="eliminate${product.idProduct}"><i class="fa-sharp fa-solid fa-cart-xmark iconEliminateProduct"></i></button>
        </div>
    </div>
    `

shopCartMenuBody.appendChild(div);
cartUpdate();

// BOTON DE ELIMINADO DE CARRITO

let eliminateProduct = document.getElementById(`eliminate${product.idProduct}`);
eliminateProduct.addEventListener("click", () => {

    let cartProductList = eliminateProduct.closest(".cartProductList");
    cartProductList.remove();
// producto eliminado
shopCartStorage = shopCartStorage.filter(item => item.idProduct != product.idProduct)
cartUpdate();
localStorage.setItem("shopCartStorage", JSON.stringify(shopCartStorage));
})};


// FILTRADO POR BUSCADOR / SEARCHER
let query = document.getElementById("searchInput").value;
let searchButton = document.getElementById("searchButton");
let searchForm = document.getElementById("searcher");

searchForm.addEventListener("submit", (e) => {
e.preventDefault();
    let inputs = e.target.children;
    let query = inputs[0].value.trim();
    let arrayIncludes = [];

stockStorage.forEach(product => {
 
let includesOrNot = product.nameProduct.toLowerCase().includes(query.toLowerCase());

const inputValue = query;
const regex = /\s{2,}/g;
const newInputValue = inputValue.replace(regex, ' ');

 if(includesOrNot){
    cardSection.innerHTML = "";
    arrayIncludes.push(product);
    cards(arrayIncludes);
} else if (query === "" || inputValue !== newInputValue){
      cardSection.innerHTML = "";
      cards(stockStorage); 
}})
if(arrayIncludes.length === 0){
    cards(stockStorage);
}});
/* FILTRADO */
let allFilter = document.getElementById("allFilter");
let upToDown = document.getElementById("upToDown"); 
let downToUp = document.getElementById("downToUp"); 

allFilter.addEventListener("click", () => {
    cardSection.innerHTML = "";
    cards(stockStorage)
});
upToDown.addEventListener("click", () =>{
    cardSection.innerHTML = "";
    let upToDownStorage = stockStorage.slice().sort((a, b) => (a.priceProduct - b.priceProduct));
    cards(upToDownStorage);
});
downToUp.addEventListener("click", () => {
    cardSection.innerHTML = "";
    let downToUpStorage = stockStorage.slice().sort((a, b) => (b.priceProduct - a.priceProduct));
    cards(downToUpStorage);
});

// CONSTRUCTOR SECCION PRODUCCION DE LA CASA

const bringData = async() => {
    const response = await fetch("./data.json");
    const data = await response.json();
const outStandartSection = document.getElementById("outStandartSection")

data.forEach(product => {
    let div = document.createElement("div");
    div.className = "mycard";

    div.innerHTML = `
    <img src="${product.URLimg}" alt="${product.URLDescription}">
    <div class="cardContent">
    <div class="wordCard">
    <h2 class="productNameCard">${product.nameProduct.toUpperCase()}</h2>
    <p class="handmakerName">${product.handmakerName}</p>
    </div>
    <div class="buttonToRight">
    <b class="price">$${product.priceProduct}</b>
    <button id="addToBuy_${product.idProduct}" class="buttonShopCart">Añadir Al Carrito</button>
    </div>
    </div>
    `
    outStandartSection.append(div);

    let button = document.getElementById(`addToBuy_${product.idProduct}`);
    button.addEventListener("click", () => addProduct(product.idProduct));   
})
}

/* // API DE MERCADO PAGO
 fetch('https://api.mercadopago.com/v1/customers', {

method: "POST",
headers : {
    "Authorization": "Bearer <ENV_ACCESS_TOKEN>",
    'Content-Type': 'application/json'
},
body: JSON.stringify({
  "email": "jhon@doe.com",
  "first_name": "Jhon",
  "last_name": "Doe",
  "phone": {
    "area_code": "55",
    "number": "991234567"
  },
  "identification": {
    "type": "CPF",
    "number": "12345678900"
  },
  "default_address": "Home",
  "address": {
    "id": "123123",
    "zip_code": "01234567",
    "street_name": "Rua Exemplo",
    "street_number": 123,
    "city": {}
},
  "date_registered": "2021-10-20T11:37:30.000-04:00",
  "description": "Description del user",
  "default_card": "None"
 })
}) */



 
// INICIALIZACION DE LA PAGINA
bringData();
cards(stockStorage);
shopMenu();
