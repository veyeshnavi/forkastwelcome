let temperature;
let tempIndex = 0;
let tempColors = [];
let inputCategory = ''; // A, B, C, D
let cloudiness = 0;
let starPoints = 3;
let windInput = "W10"; // W1 to W10
let tomatoInput = "tomato1"; // tomato1 to tomato3
let selectedIngredients = ['ingredient2', 'ingredient3']; // Any 2 from ingredient1 to ingredient10

let weatherApiCalled = false;
let canvas;
let qr;

async function getWeather() {
    let apiKey = "cc30af8aa89625eb2c1bc52e7c52baba";
    let city = CrossScriptVars.location;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        let response = await fetch(url);
        let data = await response.json();

        temperature = data.main.temp;
        cloudiness = data.clouds.all;

        if (temperature <= 10) tempIndex = 0;
        else if (temperature <= 19) tempIndex = 1;
        else if (temperature <= 29) tempIndex = 2;
        else tempIndex = 3;

        starPoints = Math.floor(cloudiness / 10) + 1;
        starPoints = constrain(starPoints, 3, 10);

        loop();
    } catch (error) {
        console.error("Failed to load weather data:", error);
    }
}

function draw() {
    background(0);

    push(); 
    //translate(300, 0);    // <--------------------- CHANGE THIS TO MOVE THINGS UP DOWN LEFT OR RIGHT

    if (weatherApiCalled == false) {

        inputCategory = CrossScriptVars.wakeTime;

        canvas = createCanvas(windowWidth, windowHeight * 3);
        canvas.style('z-index', '-1');
        angleMode(RADIANS);
        frameRate(60);

        tempColors = [
            color(124, 138, 239),    // Cold (≤10)
            color(124, 138, 239),  // Cool (11–19)
            color(245, 120, 145),  // Warm (20–29)
            color(222, 68, 71)     // Hot (≥30)
        ];

        getWeather();
        weatherApiCalled = true;

        loadRecipeDatabase();

        let btn = createButton('Generate QR of Canvas');
        btn.position(600, 575);
        btn.style('z-index', '5');
        btn.mousePressed(generateQR);

    }

    scale(0.75); // <--------------------- CHANGE THIS TO CHANGE SIZE OF THE STUFF IN THE CANVAS


    /*
    console.log("Cross Script Vars ingredient 2: " + CrossScriptVars.ingredient_2_string);
    console.log("Cross Script Vars City: " + CrossScriptVars.location);
    console.log("Cross Script Vars City: " + CrossScriptVars.wakeTime);
    console.log("Cross Script Vars City: " + CrossScriptVars.ingredient_1);
    console.log("Cross Script Vars City: " + CrossScriptVars.ingredient_2);
    console.log("Cross Script Vars City: " + CrossScriptVars.tomatoAnswer);
    console.log("Cross Script Vars City: " + CrossScriptVars.tooManyCount);
    */

    strokeCap(SQUARE)
    // === Rectangle 1 ===
    let x = 10, y = 10, w = 253, h = 283;
    //stroke(0);
    //strokeWeight(2);
    noStroke ()
    fill(253, 242, 195);
    rect(x, y, w, h, 5);

    if (tempIndex !== -1) {
        fill(tempColors[tempIndex]);
        let cx = x + w;
        let cy = y + h / 2;
        let baseDiameter = 80;
        let spacing = 40;
        let diameter = baseDiameter + spacing * tempIndex;
        arc(cx, cy, diameter, diameter, HALF_PI, -HALF_PI, CHORD);
    }

    // === Rectangle 2 ===
    let x2 = 10, y2 = 303, w2 = 253, h2 = 283;
    fill(250, 208, 44);
    //stroke(0);
   // strokeWeight(2);
    rect(x2, y2, w2, h2, 5);
    noStroke ()
    fill(0);
    switch (inputCategory) {
        case '4AM - 7AM':
            triangle(x2, y2, x2, y2 + h2, x2 + w2, y2 + h2 / 2);
            break;
        case '7AM - 10AM':
            triangle(x2 + w2, y2, x2 + w2, y2 + h2, x2, y2 + h2 / 2);
            break;
        case '10AM - 1PM':
            triangle(x2, y2, x2 + w2, y2, x2 + w2 / 2, y2 + h2);
            break;
        case '1PM - 4PM':
            triangle(x2, y2 + h2, x2 + w2, y2 + h2, x2 + w2 / 2, y2);
            break;
    }

    // === Rectangle 3: Star ===
    let x3 = 273, y3 = 10, w3 = 283, h3 = 186;
    fill(222, 68, 71);
    stroke(30);
    strokeWeight(2);
    rect(x3, y3, w3, h3, 5);

    push();
    let cx3 = x3 + w3 / 2;
    let cy3 = y3 + h3 / 2;
    translate(cx3, cy3);
    rotate(frameCount * 0.01);
    fill(181, 216, 51);
    noStroke();
    let maxStarRadius = (h3 - 10) / 2;
    star(0, 0, maxStarRadius * 0.2, maxStarRadius, starPoints);
    pop();


    // === Rectangle 4: Wind Arcs ===
    let x4 = 273, y4 = 206, w4 = 283, h4 = 186;
    fill(124, 138, 239);
    stroke(30);
    strokeWeight(2);
    rect(x4, y4, w4, h4, 5);

    let linesToShow = constrain(parseInt(windInput.slice(1)), 1, 10);
    linesToShow = CrossScriptVars.tooManyCount;

    let arcCenterX = x4 + w4 / 2;
    let arcCenterY = y4 + h4 / 1.02;
    let arcRadius = w4 / 2 - 20;
    stroke(255);
    strokeWeight(4);
    for (let i = 0; i < linesToShow; i++) {
        let angle = map(i, 0, 9, PI, 0);
        let xEnd = arcCenterX + cos(angle) * arcRadius;
        let yEnd = arcCenterY - sin(angle) * arcRadius;
        line(arcCenterX, arcCenterY, xEnd, yEnd);
    }


    // === Rectangle 5: Tomatoes ===
    let x5 = 273, y5 = 402, w5 = 283, h5 = 186;
    fill(181, 216, 51);
    stroke(30);
    strokeWeight(2);
    rect(x5, y5, w5, h5, 5);

    let circleDiameter = 70;
    let gap = 16;
    let totalWidth = 3 * circleDiameter + 2 * gap;
    let startX = x5 + (w5 - totalWidth) / 2;
    let centerY = y5 + h5 / 2;
    let redColor = color(222, 68, 71);

    for (let i = 0; i < 3; i++) {
        let cx = startX + i * (circleDiameter + gap) + circleDiameter / 2;
        fill(redColor);
        noStroke();
        ellipse(cx, centerY, circleDiameter);

        if (i == 0)
            if (CrossScriptVars.tomatoAnswer === 'Yes, of course') {
                push();
                translate(cx, centerY - circleDiameter / 2 - 10);
                fill(0);
                noStroke();
                star(0, 12, 10, 20, 8);
                pop();
            }

        if (i == 1)
            if (CrossScriptVars.tomatoAnswer === 'Nooooo') {
                push();
                translate(cx, centerY - circleDiameter / 2 - 10);
                fill(0);
                noStroke();
                star(0, 12, 10, 20, 8);
                pop();
            }

        if (i == 2)
            if (CrossScriptVars.tomatoAnswer === 'Maybe???') {
                push();
                translate(cx, centerY - circleDiameter / 2 - 10);
                fill(0);
                noStroke();
                star(0, 12, 10, 20, 8);
                pop();
            }
    }

    // === Rectangle 6: Ingredients ===
    let x6 = 566, y6 = 10, w6 = 223, h6 = 580;
    fill(245, 120, 145);
    stroke(30);
    strokeWeight(2);
    rect(x6, y6, w6, h6, 5);

    let spacing = w6 / 11;
    stroke(255);
    for (let i = 0; i < 10; i++) {
        //let ingredientName = `ingredient${i + 1}`;
        //let sw = selectedIngredients.includes(ingredientName) ? 10 : 2;
        let sw = 2;

        if (i == CrossScriptVars.ingredient_1 || i == CrossScriptVars.ingredient_2)
            sw = 10;

        strokeWeight(sw);
        let lx = x6 + spacing * (i + 1);
        line(lx, y6 + 10, lx, y6 + h6 - 10);
    }

    translate(600, 60);


    generateRecipe();
    drawRecipeScreen();

    pop();
}


function drawRecipeScreen() {
   

    

    // Recipe content
    noStroke ()
    fill(251, 179, 41);
    textAlign(CENTER, CENTER);
    textSize(48);
    textStyle(NORMAL);
   

    textSize(48);
    textStyle(NORMAL);
    text(currentPoem, windowWidth / 2, 280);

    


}



function star(x, y, radius1, radius2, npoints = 9) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function keyPressed() {
    if (key === 'P') {
        printCanvas();
    }
}

function printCanvas() {
    let canvas = document.querySelector('canvas');
    let dataUrl = canvas.toDataURL();

    let printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
    <html>
      <head>
        <title>Print Canvas</title>
        <style>
          body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
          img { width: 100%; max-width: 100%; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" />
        <script>
          window.onload = function() {
            window.print();
          }
        </script>
      </body>
    </html>
  `);
    printWindow.document.close();
}

function loadRecipeDatabase() {
    // Load from Google Sheets CSV
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRIjFPam4PRCF8bZz7_pKOittU3B24ljMyDDCJxdN30xjVw7hMueW4V3GcoiljyS_Mj9gw1d_dR-Swd/pub?gid=111001435&single=true&output=csv';

    Papa.parse(csvUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            console.log('Recipe database loaded:', results.data.length, 'recipes');

            results.data.forEach(row => {
                if (row.Ingredient1 && row.Ingredient2 && row.Poem) {
                    const key1 = row.Ingredient1 + '-' + row.Ingredient2;
                    const key2 = row.Ingredient2 + '-' + row.Ingredient1;
                    const poem = row.Poem.replace(/\\n/g, '\n');

                    recipeDatabase[key1] = poem;
                    recipeDatabase[key2] = poem;
                }
            });

            console.log('Recipe combinations loaded:', Object.keys(recipeDatabase).length);
        },
        error: function (error) {
            console.warn('Failed to load recipe database:', error);
            // Fallback recipes
            recipeDatabase = {
                'Apple-Orange': 'Golden apple meets citrus bright,\nA morning blend of pure delight.\nSlice them thin and layer neat,\nA healthy, colorful morning treat!',
                'Orange-Apple': 'Golden apple meets citrus bright,\nA morning blend of pure delight.\nSlice them thin and layer neat,\nA healthy, colorful morning treat!'
            };
        }
    });
}

function generateRecipe() {
    const key1 = CrossScriptVars.ingredient_1_string + '-' + CrossScriptVars.ingredient_2_string;
    const key2 = CrossScriptVars.ingredient_2_string + '-' + CrossScriptVars.ingredient_1_string;

    if (recipeDatabase[key1]) {
        currentPoem = recipeDatabase[key1];
    } else if (recipeDatabase[key2]) {
        currentPoem = recipeDatabase[key2];
    } else {
        // Generate a fallback poem based on user choices and weather
        const tempDesc = userChoices.weatherData.temperature > 25 ? 'cooling' :
            userChoices.weatherData.temperature < 15 ? 'warming' : 'refreshing';

        currentPoem = `${CrossScriptVars.ingredient_1_string} and ${CrossScriptVars.ingredient_2_string} unite,\nA ${tempDesc} blend for ${userChoices.location}'s delight.\nPerfect for those who wake at ${userChoices.wakeTime},\nMixed with love in weather so fine!\n\nTemperature: ${userChoices.weatherData.temperature}°C\nClouds: ${userChoices.weatherData.cloudCover}%`;
    }



    console.log(currentPoem);
}

async function generateQR() {
    // Convert canvas to Base64 PNG
    let imgData = canvas.elt.toDataURL("image/png").split(',')[1]; // remove data:image/png;base64,

    // Upload to imgbb
    let apiKey = "90837e8dbd6c08c0146be0ee2de5525b"; // Replace this with your real API key
    let formData = new FormData();
    formData.append("key", apiKey);
    formData.append("image", imgData);

    const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData
    });

    const data = await res.json();
    const imageUrl = data.data.url;

    console.log("Image URL:", imageUrl);

    showQR(imageUrl);
}

function showQR(url) {
    // Remove existing QR
    let oldQR = document.getElementById("qr-code");
    if (oldQR) oldQR.remove();

    // Create QR canvas element
    let qrCanvas = document.createElement("canvas");
    qrCanvas.id = "qr-code";
    qrCanvas.style.position = "absolute";
    qrCanvas.style.left = "20px"; // same as the button
    qrCanvas.style.top = "60px";  // right below the button
    qrCanvas.style.zIndex = "10"; // ensure it appears above p5 canvas

    document.body.appendChild(qrCanvas);

    console.log("appending QR");

    new QRious({
        element: qrCanvas,
        value: url,
        size: 50
    });
}

