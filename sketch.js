let myTable; //variabile vuota per mettere dentro il csv
let maxVisitatori = 0;
let margin = 20;
let gutter = 4;
let spazioSopra = 80;
let coloreSfondo = '#110106';

let colori = {
  "United Kingdom": "#9B287B",
  "Japan":          "#FAA916",
  "France":         "#5FA8D3",
  "United States":  "#1D9A6C",
  "Poland":         "#C77DFF",
  "South Korea":    "#FF85A1",
  "Russia":         "#f9d0a2",
  "Mexico":         "#a2b94e",
  "China":          "#D00000",
  "Spain":          "#aa9066",
  "Netherlands":    "#FA8334",
  "Australia":      "#4e5cd8",
  "Vatican City":   "#787878",
  "Taiwan":         "#ee196e",
  "Singapore":      "#bbb3da",
  "Italy":          "#C44536",
  "Greece":         "#023E8A"
};

async function setup() {
  createCanvas(windowWidth, windowHeight);

  myTable = await loadTable("assets/museums.csv", ",", "header");

  for (let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++) {
    let visitatori = myTable.getNum(numRiga, "visitors_2025");
    if (visitatori > maxVisitatori) {
      maxVisitatori = visitatori;
    }
  }
}

function draw() {
  background(coloreSfondo);
  textFont('JetBrainsMono-Variable, monospace'); //messo un altro carattere nel caso in cui quello che ho scelto non si dovesse caricare

  let numeroGutter = myTable.getRowCount() - 1; //deve esserci uno spazio in meno rispetto al numero di elementi perchè poi c'è il margine
  let larghezza = (width - 2 * margin - numeroGutter * gutter) / myTable.getRowCount();

  let posx = margin;
  let label = ""; //variabile per il testo che esce al rollover del mouse

  //ciclo per disegnare le barre
  for (let numRiga = 0; numRiga < myTable.getRowCount(); numRiga++) {
    let visitatori = myTable.getNum(numRiga, "visitors_2025");
    let paese = myTable.getString(numRiga, "country");
    let nome = myTable.getString(numRiga, "museum");

    // altezza massima > lascia spazio sopra per titolo e legenda
    let altezza = map(visitatori, 0, maxVisitatori, 0, height - 2 * margin - spazioSopra);
    let yBase = height - margin;
    let yTop = yBase - altezza;
    let xCentro = posx + larghezza / 2;

    // disegno glifi colonna
    disegnoColonna(xCentro, yBase, yTop, larghezza, colori[paese]);

    // rollover
    if (mouseX >= posx && mouseX <= posx + larghezza &&
        mouseY >= yTop && mouseY <= yBase) {
      label = nome + " (" + paese + ")";
    }

    posx += larghezza + gutter;
  }

  noStroke();
  textAlign(LEFT, CENTER);

  // titolo
  fill(238, 229, 233);
  textSize(28);
  text("Most visited art museums in 2025", margin, margin + 15);

  // legenda
  textSize(12);
  let legX = width - 160;
  let legY = margin + 10;
  let i = 0;
  for (let paese in colori) {
    fill(colori[paese]);
    circle(legX, legY + i * 20, 10);
    fill(238, 229, 233);
    text(paese, legX + 12, legY + i * 20);
    i++;
  }

  // testo rollover
  if (label != "") {
    let larghezzaTesto = textWidth(label);
    let padding = 6;
    let x = mouseX + 8;
    let y = mouseY + 16;
    
    // evitare che il testo esca dallo schermo
    if (x + larghezzaTesto + padding > width - margin) {
      x = mouseX - 8 - larghezzaTesto;
    }

    // sfondo grigio del testo
    noStroke();
    fill(80, 200);
    rect(x - padding, y - 6 - padding, larghezzaTesto + 2 * padding, 12 + 2 * padding);

    // testo
    fill(238, 229, 233);
    text(label, x, y);
  }
}

function disegnoColonna(xCentro, yBase, yTop, larghezza, colore) {
  
  // capitello
  let hSopra = 4; // parte più in alto del capitello
  let hMezzo = 6; // parte tra la cima e il fusto
  let hCapitello = hSopra + hMezzo;
  let yFusto = yTop + hCapitello; // dove finisce il fusto in alto

  // base
  let hTerra = 4; // rettangolo appoggiato a terra
  let hEllisse = 4; // ellisse sopra il rettangolo appoggiato a terra
  let hBase = hTerra + hEllisse;
  let yFustoBasso = yBase - hBase; // dove inizia il fusto in basso

  let wBase = larghezza * 0.8; // larghezza del fusto in basso
  let wCima = larghezza * 0.65; // larghezza del fusto in alto

  fill(colore);

  // terra
  rect(xCentro - larghezza / 2, yBase - hTerra, larghezza, hTerra);

  // ellisse (con angoli arrotondati)
  rect(xCentro - larghezza * 0.45, yBase - hBase, larghezza * 0.9, hEllisse, 2);

  // fusto
  quad(xCentro - wBase / 2, yFustoBasso,
       xCentro + wBase / 2, yFustoBasso,
       xCentro + wCima / 2, yFusto,
       xCentro - wCima / 2, yFusto);

  // scanalature > 3 linee scure lungo il fusto
  stroke(coloreSfondo);
  strokeWeight(1);
  for (let k = -1; k <= 1; k++) {
    line(xCentro + k * wBase / 4, yFustoBasso,
         xCentro + k * wCima / 4, yFusto);
  }
  noStroke();

  // mezzo
  quad(xCentro - wCima / 2, yFusto,
       xCentro + wCima / 2, yFusto,
       xCentro + larghezza * 0.45, yTop + hSopra,
       xCentro - larghezza * 0.45, yTop + hSopra);

  // sopra
  rect(xCentro - larghezza / 2, yTop, larghezza, hSopra);
}