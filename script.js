const hourHand = document.querySelector("#hour-hand");
const minuteHand = document.querySelector("#minute-hand");
const secondHand = document.querySelector("#second-hand");
const averageHand = document.querySelector("#average-hand");
const smallcircle = document.querySelector("#small-circle");

function setRotation(hand, rotation) {
    hand.style.setProperty('--rotation', rotation+"deg");
}

function toggle(){ 
    if (minuteHand.style.visibility == "hidden") {
        minuteHand.style.visibility = "visible";
        secondHand.style.visibility = "visible";
        hourHand.style.visibility = "visible";
    } else {
        minuteHand.style.visibility = "hidden";
        secondHand.style.visibility = "hidden";
        hourHand.style.visibility = "hidden";
    }
} //using this except toggle for awesome


function setClock() {
    const currentDate = new Date();
    const seconds = currentDate.getSeconds();
    const minutes = currentDate.getMinutes();
    const hours = currentDate.getHours();
    const milliseconds = currentDate.getMilliseconds();
    //const secondsRotation = (seconds + (milliseconds / 1000)) /60 * 360;
    //const minutesRotation = (minutes + /*SCR*/(seconds + (milliseconds / 1000)) / 60/*SCR*/)/60 * 360;
    //const hoursRotation = ((hours + /*MNR*/(minutes + /*SCR*/(seconds + (milliseconds / 1000)) / 60/*SCR*/) / 60/*MNR*/) / 12) * 360;
    //
    //simplified - i hate low precision
    //in degrees, not in radians  - i dont care about precision that much
    const secondsRotation = seconds * 6 + milliseconds * 3 / 500;
    const minutesRotation = minutes * 6 + /*SCR*/seconds/10 + milliseconds / 10000/*SCR*/;
    const hoursRotation = hours * 30 + /*MNR*/minutes/2 + /*SCR*/seconds/120 + milliseconds / 120000/*SCR*//*MNR*/;
    //code for the average hand
    //hate what i have to do so im not doing it proper
    //
    //basically: i want an average hand->i need an "average angle"->mathematically equivalent to a normalised addition of vectors and then Math.asin()
    //sqrt((x1 + x2 + x3) ** 2 + (y1 + y2 + y3) ** 2) = length   (x1 + x2 + x3) / length=normal   Math.asin(normal) = averageRotation
    //
    //i dont care about plus or minus because squared makes it absolute - edit LIE I HAVE TO FUCK
    //FUCK i have to use about 9 sin functions
    //
    //OBVIOUSLY i need it in RADIANS FFS x*pi/180
    //
    //fun fact: this is stupid!
    //
        //const length = Math.sqrt((Math.sin(secondsRotation * (Math.PI / 180)) + Math.sin(minutesRotation * Math.PI / 180) + Math.sin(hoursRotation * Math.PI / 180)) ** 2 + (Math.cos(secondsRotation * Math.PI / 180) + Math.cos(minutesRotation * Math.PI / 180) + Math.cos(hoursRotation * Math.PI / 180)) ** 2);
        //const normalizedx = (Math.sin(secondsRotation * Math.PI / 180) + Math.sin(minutesRotation * Math.PI / 180) + Math.sin(hoursRotation * Math.PI / 180)) / length;
        //const normalizedy = (Math.cos(secondsRotation * Math.PI / 180) + Math.cos(minutesRotation * Math.PI / 180) + Math.cos(hoursRotation * Math.PI / 180)) / length;
        //const averageRotation = Math.asin(normalizedx) / Math.PI * 180 * -1 + 180;
    const pi = Math.PI;
    //*2*length% - less readable, good!
    const averageX = Math.sin(secondsRotation * pi / 180) * 0.96 + Math.sin(minutesRotation * pi / 180) * 0.80 + Math.sin(hoursRotation * pi / 180) * 0.60;
    const averageY = Math.cos(secondsRotation * pi / 180) * 0.96 + Math.cos(minutesRotation * pi / 180) * 0.80 + Math.cos(hoursRotation * pi / 180) * 0.60; 
    //for it to be a real average it would need to be divided by three, but the later use in the atan simplifies that
    // i dont understand this, just fixed with experimental values. remembered that tan exists -> got rid of most of it
    const averageRotation = Math.atan(averageY / averageX) * -180 / pi + 90 + (averageX < 0) * -180;
    setRotation(secondHand, secondsRotation);
    setRotation(minuteHand, minutesRotation);
    setRotation(hourHand, hoursRotation);
    setRotation(averageHand, averageRotation);
    // length in percent -> HALF HEIGHT of clock is a FULL LENGTH HAND
    // pocitam v cislech od 0-1, chci od 0-50%, procenta se pridaji zbytek se vynasobi   abych se zbavil tresu tak jsem se pokusil to dat v pixelech, dela to horsi!
    // Math.sqrt(averageX * averageX + averageY * averageY) this is faster than doing it with mathpow or ** 2 - length so i want pythagoras
    averageHand.style.setProperty('--scalefactor', Math.sqrt(averageX * averageX + averageY * averageY)) //decided not to average it because it looks worse
    //TODO: convert everything into radians - probably will looks better, try find places to get more precision     fuck this only imprecision is when rendering
}

setClock(); //to get rid of first frame not showing properly
setInterval(setClock, 16.67); //i refuse using the requestframe whatever because it wouldnt work at all and the only actual benefit would be that it looks nicer when you refresh it fast