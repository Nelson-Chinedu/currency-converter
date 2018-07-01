let currentDate = document.getElementById("currentDate");
let dt = new Date();
let todayDate = dt.toLocaleDateString();
currentDate.textContent = todayDate;


function isNumberKey(evt){
         var charCode = (evt.which) ? evt.which : event.keyCode
         if (charCode > 31 && (charCode < 48 || charCode > 57))
          return false;
        
         return true;
      }


//registering service worker
if ('serviceWorker' in navigator) {
navigator.serviceWorker.register(`${window.location.pathname}sw.js`)
  .then((reg) => {
      if(reg.installing) {
      console.log('Service worker installing');
    } else if(reg.waiting) {
      console.log('Service worker installed');
    } else if(reg.active) {
      console.log('Service worker active');
    }
  }).catch((error) => {
  console.log("service worker failed to register", error)
 });
}



// fetching list of currencies
fetch('https://free.currencyconverterapi.com/api/v5/currencies')
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    Object.keys(data).map((currencies) => {
      const currencyLists = data[currencies]
      Object.keys(currencyLists).map((currencyId) => {
        const currId = currencyLists[currencyId]

        //conversion from
        const listOfCurrenciesA = document.getElementById('currenciesA');
        const currencyFrom = document.createElement("option");
        currencyFrom.setAttribute("id", "currencyFrom");
        currencyFrom.text =  currId.id + ' ' + currId.currencyName;
        currencyFrom.value = currId.id;
        
        listOfCurrenciesA.appendChild(currencyFrom);


        //conversion to
        const listOfCurrenciesB = document.getElementById('currenciesB');
        const currencyTo = document.createElement("option");
        currencyTo.setAttribute("id", "currencyTo");
        currencyTo.text = currId.id + ' ' + currId.currencyName;
        currencyTo.value = currId.id;
        listOfCurrenciesB.appendChild(currencyTo);
      });
    })
  });



window.onload = function () {
  document.getElementById('btn').addEventListener('click', (e) => {
    e.preventDefault();
    const currFrom = document.getElementById('currenciesA').value
    const currTo = document.getElementById('currenciesB').value
    const query = currFrom + '_' + currTo;

    // querying Api for the exchangeRate value
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        Object.keys(data).map((resultValue)=>{
          const exchangeRate = data[resultValue].val
          document.getElementById('rate').innerHTML = exchangeRate.toFixed(2);
          const inputAmount = document.getElementById('currencyFrom').value;
          const exchangeResult = exchangeRate * inputAmount;
          document.getElementById('currencyTo').value = exchangeResult.toFixed(2);
        })
      })
  });
}
