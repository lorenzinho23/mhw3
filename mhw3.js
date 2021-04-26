// API n.1: Yahoo Finance - con API key

const yahoo_endpoint_token = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/auto-complete?q=tesla&region=US';
const yahoo_key = '48cae35104msh76f7a4458152149p181c22jsne2dfc3b5ae85';
const yahoo_host = 'apidojo-yahoo-finance-v1.p.rapidapi.com';
const yahoo_stock = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/'
const yahoo_market = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/'

// API n.2: Twelve Data - con API key
const twelvedataKey = 'b5130d9dcae24efa99733ded9e8272e8';
const twelvedataEndpoint = 'https://api.twelvedata.com/';
const twelvedata_stocks = 'https://api.twelvedata.com/stocks';


// Assegno l'eventListener al tasto "CERCA"
const form_cerca = document.querySelector('#search_content');
form_cerca.addEventListener("submit", search);

// Assegno l'eventListener al tasto per mostrare la Lista
const elenco = document.querySelector("#elenco");
elenco.addEventListener("click", mostraLista);

// Assegno l'eventListener al tasto per mostrare la legenda
const legenda = document.querySelector("#tastoLegenda");
legenda.addEventListener("click", mostraLegenda);

// Assegno l'eventListener per aggiornare la pagina e svuotarla
const aggiorna = document.querySelector("#aggiorna");
aggiorna.addEventListener("click", aggiornaPagina1);

const aggiorna2 = document.querySelector("#aggiorna2");
aggiorna2.addEventListener("click", aggiornaPagina2);

function aggiornaPagina1() {
    const lista = document.querySelector('#lista1');
    lista.innerHTML = '';
}

function aggiornaPagina2() {
    const lista = document.querySelector('#lista2');
    lista.innerHTML = '';
}

function search(event) {
    // evito il comportamento predefinito (inviare il form al server)
    event.preventDefault();       
    
    // seleziono cioò che scrivo nella barra di ricerca
    const content = document.querySelector("#content").value;

    if (!content) {     
        alert("Inserisci del testo nella barra di ricerca");
    }
    else {
        // converto in testo
        const text = encodeURIComponent(content);   
        // seleziono il tipo di ricerca
        const tipo = document.querySelector("#tipo").value;     
        
        // a seconda del tipo di ricerca l'API svolge diverse funzioni
        if (tipo === "dati") {
            fetch(yahoo_stock + "v2/get-summary?symbol="+text, {
            method: "GET",
            headers: {
                "x-rapidapi-key": yahoo_key,
                "x-rapidapi-host": yahoo_host
            }
            }).then(onResponse).then(onJSONDati);
        }
        
        if (tipo === "simbolo") {
            fetch("https://"+ yahoo_host + "/auto-complete?q="+text, {
                method: "GET",
                headers: {
                    "x-rapidapi-key": yahoo_key,
                    "x-rapidapi-host": yahoo_host
                }
            }).then(onResponse).then(onJSONSimbolo); 
        }        
    }
}

// FUNZIONI INTERATTIVE (pulsanti)
function mostraLista(event) {
    const e = event.currentTarget;
    
    const lista = document.querySelector("#simboli");
    lista.classList.remove("hidden");
    e.removeEventListener("click",mostraLista);
    e.addEventListener("click", nascondiLista);
}

function nascondiLista(event) {
    const e = event.currentTarget;

    const lista = document.querySelector("#simboli");
    lista.classList.add("hidden");
    e.removeEventListener("click",nascondiLista);
    e.addEventListener("click", mostraLista);
}

function mostraLegenda(event) {
    const l = event.currentTarget;

    const legenda = document.querySelector("#legenda");
    legenda.classList.remove("hidden");
    l.removeEventListener("click",mostraLegenda);
    l.addEventListener("click", nascondiLegenda);
}

function nascondiLegenda(event) {
    const l = event.currentTarget;

    const lista = document.querySelector("#legenda");
    lista.classList.add("hidden");
    l.removeEventListener("click",nascondiLegenda);
    l.addEventListener("click", mostraLegenda);
}

function onResponse(response) {
    return response.json();
}

// FUNZIONI JSON
// RICERCA SIMBOLO AZIENDE
function onJSONSimbolo(json) {
    console.log(json);
    
    
    const lista = document.querySelector('#lista2');
    lista.innerHTML = '';
    
    const results = json.quotes;
    
    if (results.length === 0) {
        const error = document.createElement("h1");     
        const message = document.createTextNode("Nessun risultato");    
        error.appendChild(message);                     
        lista.appendChild(error); 
    }
    for (result of results) {
        const nome = document.createElement("h1");
        nome.textContent = result.shortname;
        const simbolo = document.createElement("p");
        simbolo.textContent = "Simbolo:" + result.symbol;
        const exchange = document.createElement("p");
        exchange.textContent = "Exchange:" + result.exchange;
        
        lista.appendChild(nome);
        lista.appendChild(simbolo);
        lista.appendChild(exchange);
        
    }
}

// RICERCA DATI AZIENDE
function onJSONDati(json) {
    console.log(json);

    const lista = document.querySelector("#lista2");
    lista.innerHTML = '';
    
    const container = document.createElement("div");
    container.classList.add("container");
    const nome = document.createElement("h1");
    nome.textContent = "Nome:" + json.quoteType.shortName;
    const settore = document.createElement("p");
    settore.textContent = "Settore:" + json.summaryProfile.sector;
    const prezzo = document.createElement("p");
    prezzo.textContent = "Prezzo corrente:" + json.financialData.currentPrice.fmt;
    const valuta = document.createElement("p");
    valuta.textContent = "Valuta:" + json.summaryDetail.currency;
    const high = document.createElement("p");
    high.textContent = "Massimo del giorno:" + json.summaryDetail.regularMarketDayHigh.fmt;
    const low = document.createElement("p");
    low.textContent = "Minimo del giorno:" + json.summaryDetail.regularMarketDayLow.fmt;
    const open = document.createElement("p");
    open.textContent = "Apertura:" + json.summaryDetail.regularMarketOpen.fmt;
    const close = document.createElement("p");
    close.textContent = "Chiusura:" + json.summaryDetail.regularMarketPreviousClose.fmt;
    const volume = document.createElement("p");
    volume.textContent = "Volume:" + json.summaryDetail.regularMarketVolume.fmt;
    
    container.appendChild(nome);
    container.appendChild(settore);
    container.appendChild(prezzo);
    container.appendChild(valuta);
    container.appendChild(high);
    container.appendChild(low);
    container.appendChild(open);
    container.appendChild(close);
    container.appendChild(volume);
    lista.appendChild(container);
} 


// API n2 - EXCHANGE RATE E CURRENCY CONVERSION
const scelta_valori = document.querySelector("#scelta_valori");
scelta_valori.addEventListener("click", mostraValori);

const scelta_conversione = document.querySelector("#scelta_conversione");
scelta_conversione.addEventListener("click", mostraConversione);

const form_conversione = document.querySelector('#conversione');
form_conversione.addEventListener("submit", exchange);

const form_valori = document.querySelector('#valori');
form_valori.addEventListener("submit", valori);


function mostraValori(event) {
    const v = event.currentTarget;

    const valori = document.querySelector("#valori");
    valori.classList.remove("hidden");
    v.removeEventListener("click",mostraValori);
    v.addEventListener("click", nascondiValori);
}

function nascondiValori(event) {
    const va = event.currentTarget;

    const valori = document.querySelector("#valori");
    valori.classList.add("hidden");
    va.removeEventListener("click", nascondiValori);
    va.addEventListener("click", mostraValori);
}

function mostraConversione(event) {
    const c = event.currentTarget;

    const conversione = document.querySelector("#conversione");
    conversione.classList.remove("hidden");
    c.removeEventListener("click",mostraConversione);
    c.addEventListener("click", nascondiConversione);
}

function nascondiConversione(event) {
    const co = event.currentTarget;

    const conversione = document.querySelector("#conversione");
    conversione.classList.add("hidden");
    co.removeEventListener("click",nascondiConversione);
    co.addEventListener("click", mostraConversione);
}

function exchange(event) {
    event.preventDefault();

    const quantita = document.querySelector("#quantita").value;
    const iniziale = document.querySelector("#iniziale").value;
    const finale = document.querySelector("#finale").value;

    if (!quantita) {     
        alert("Inserisci una quantità nella barra di ricerca");
    }
    else {
        const quant = encodeURIComponent(quantita);
        const da = encodeURIComponent(iniziale);
        const a = encodeURIComponent(finale);
        
        twelve_request = twelvedataEndpoint + "currency_conversion?symbol=" 
            + da + "/" + a + "&amount=" + quant + "&apikey=" + twelvedataKey;
        fetch(twelve_request).then(onResponse).then(onJSONConv);
    }
}

function valori (event) {
    event.preventDefault();

    const iniz = document.querySelector("#by").value;
    const fin = document.querySelector("#to").value;
    
    const by = encodeURIComponent(iniz);
    const to = encodeURIComponent(fin);

    valori_request = twelvedataEndpoint + "exchange_rate?symbol=" 
                + by + "/" + to + "&apikey=" + twelvedataKey;
    fetch(valori_request).then(onResponse).then(onJSONMoneta); 
}

function onResponse(response) {
    return response.json();
}

function onJSONConv(json) {
    console.log(json);

    const lista = document.querySelector("#lista1");
    lista.innerHTML = '';

    const quantita = document.querySelector("#quantita").value;
    const valore = encodeURIComponent(quantita);
    const quanto = document.createElement("p");
    quanto.textContent = "Quantità:" + valore;
    const simbolo = document.createElement("p");
    simbolo.textContent = "Da: / A:" + json.symbol;
    const cambio = document.createElement("p");
    cambio.textContent = "Rate:" + json.rate;
    const risultato = document.createElement("p");
    risultato.textContent = "Valore:" + json.amount;

    lista.appendChild(quanto);
    lista.appendChild(simbolo);
    lista.appendChild(cambio);
    lista.appendChild(risultato);
}

function onJSONMoneta(json) {
    console.log(json);

    const lista = document.querySelector("#lista1");
    lista.innerHTML = '';

    const simbolo = document.createElement("p");
    simbolo.textContent = "Simbolo:" + json.symbol;
    const rate = document.createElement("p");
    rate.textContent = "Rate:" + json.rate;

    lista.appendChild(simbolo);
    lista.appendChild(rate);
}