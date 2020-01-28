var buildTimeline = function(purchaseEvent, productEvents) {
  let purchaseData = purchaseEvent['custom_data'];
  let container = document.querySelector('div.container');

  let timelineItem = document.createElement("div");
  timelineItem.setAttribute('class', 'row timeline-item');
  container.append(timelineItem);

  let linhaVertical = document.createElement("div");
  linhaVertical.setAttribute('class', 'col-sm-4 box linha-vertical');
  timelineItem.append(linhaVertical);

  let colSm7 = document.createElement("div");
  colSm7.setAttribute('class', 'col-sm-7');
  timelineItem.append(colSm7);

  let iconCheck = document.createElement("div");
  iconCheck.setAttribute('class', 'icon-check');
  colSm7.append(iconCheck);

  let cardContainer = document.createElement("div");
  cardContainer.setAttribute('class', 'card-container');
  colSm7.append(cardContainer);

  let card = document.createElement("div");
  card.setAttribute('class', 'card');
  cardContainer.append(card);

  let cardBody = document.createElement("div");
  cardBody.setAttribute('class', 'card-body');
  card.append(cardBody);

  let saleInfoBox = document.createElement("div");
  saleInfoBox.setAttribute('class', 'd-flex');
  cardBody.append(saleInfoBox);

  let dateInfoBox = document.createElement("div");
  dateInfoBox.setAttribute('class', 'd-flex');
  saleInfoBox.append(dateInfoBox);

  let dateIcon = document.createElement("div");
  dateIcon.setAttribute('class', 'icons icon-calendar');
  dateInfoBox.append(dateIcon);

  let dateInfo = document.createElement("div");
  dateInfo.setAttribute('class', 'sales-info date');
  dateInfo.innerText = formatDate(purchaseEvent['timestamp']);
  dateInfoBox.append(dateInfo);

  let timeInfoBox = document.createElement("div");
  timeInfoBox.setAttribute('class', 'd-flex');
  saleInfoBox.append(timeInfoBox);

  let timeIcon = document.createElement("div");
  timeIcon.setAttribute('class', 'icons icon-clock');
  timeInfoBox.append(timeIcon);

  let timeInfo = document.createElement("div");
  timeInfo.setAttribute('class', 'sales-info date');
  timeInfo.innerText = formatTime(purchaseEvent['timestamp']);
  timeInfoBox.append(timeInfo);

  let locationInfoBox = document.createElement("div");
  locationInfoBox.setAttribute('class', 'd-flex');
  saleInfoBox.append(locationInfoBox);

  let locationIcon = document.createElement("div");
  locationIcon.setAttribute('class', 'icons icon-place');
  locationInfoBox.append(locationIcon);

  let locationInfo = document.createElement("div");
  locationInfo.setAttribute('class', 'sales-info date');
  locationInfo.innerText = findCustomData(purchaseData, 'store_name')['value'];
  locationInfoBox.append(locationInfo);

  let priceInfoBox = document.createElement("div");
  priceInfoBox.setAttribute('class', 'd-flex');
  saleInfoBox.append(priceInfoBox);

  let priceIcon = document.createElement("div");
  priceIcon.setAttribute('class', 'icons icon-money');
  priceInfoBox.append(priceIcon);

  let priceInfo = document.createElement("div");
  priceInfo.setAttribute('class', 'sales-info date');
  priceInfo.innerText = toCurrency(purchaseEvent['revenue']);
  priceInfoBox.append(priceInfo);

  let productsInfoBox = document.createElement("div");
  productsInfoBox.setAttribute('class', 'row');
  cardBody.append(productsInfoBox);

  let productsTableBox = document.createElement("div");
  productsTableBox.setAttribute('class', 'col-sm-12 product-table table-responsive');
  productsInfoBox.append(productsTableBox);

  let productsTable = document.createElement("table");
  productsTable.setAttribute('class', 'table table-sm table-hover');
  productsTableBox.append(productsTable);

  let tableBody = document.createElement("tbody");
  productsTable.append(tableBody);

  let tableHead = document.createElement("tr");
  tableHead.setAttribute('class', 'd-flex');
  tableBody.append(tableHead);

  let productNameHead = document.createElement("th");
  productNameHead.setAttribute('class', 'col-9');
  productNameHead.setAttribute('scope', 'col');
  productNameHead.innerText = 'Produto';
  tableHead.append(productNameHead);

  let productPriceHead = document.createElement("th");
  productPriceHead.setAttribute('class', 'col-3');
  productPriceHead.setAttribute('scope', 'col');
  productPriceHead.innerText = 'Preço';
  tableHead.append(productPriceHead);


  productEvents.forEach(function(event) {
    let productData = event['custom_data'];

    if (findCustomData(productData, 'transaction_id')['value'] == findCustomData(purchaseData, 'transaction_id')['value'])  {
      let tableProductRow = document.createElement("tr");
      tableProductRow.setAttribute('class', 'd-flex');
      tableBody.append(tableProductRow);

      let productName = document.createElement("td");
      productName.setAttribute('class', 'col-9 product-name');
      productName.innerText = findCustomData(productData, 'product_name')['value'];
      tableProductRow.append(productName);

      let productPrice = document.createElement("td");
      productPrice.setAttribute('class', 'col-3 product-price');
      productPrice.innerText = toCurrency(findCustomData(productData, 'product_price')['value']);
      tableProductRow.append(productPrice);
    };
  });
}                     

function formatDate(timestamp){
  var time = new Date(timestamp);
  return `${time.getDate()}/${time.getMonth()+1}/${time.getFullYear()}`;
}

function formatTime(timestamp){
  var time = new Date(timestamp);
  return `${time.getHours()}:${time.getMinutes()}`;
}

var toCurrency = function(number) {
  return parseFloat(number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

var findCustomData = function(arr, key) {
  return arr.find( item => item['key'] == key);
}

var mountEvents = function(events) {
  let purchaseEvents = [];
  let productEvents = [];

  events.map(function(event) {
    if (event['event'] == 'comprou') {
      purchaseEvents.push(event);
    } else if (event['event'] == 'comprou-produto') {
      productEvents.push(event);
    };
  });

  purchaseEvents.forEach(function(purchaseEvent) {
    buildTimeline(purchaseEvent, productEvents);
  });
}

var fetchEvents = function() {
  let url = 'https://storage.googleapis.com/dito-questions/events.json';
  fetch(url).then(response =>{
    return response.json();
  })
  .then(data => {
    mountEvents(data.events);
  });
}

(function() {
  fetchEvents();
});
