let date = new Date();
let displayMonth = date.getMonth();
let displayYear = date.getFullYear();

main();

function main() {
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    initialize(day, month, year);
    clickNextMonth(day, month, year);
    clickPreviousMonth(day, month, year);
}

function initialize(day, month, year) {
    writeTitle(day, month, year);
    writeHeadline(day, month, year);
    writeText(day, month, year);
    createCalendar(day, month, year);
    createRandomWikiEvent(day, month + 1);
}

// ########## CLICKER ########## //

function clickPreviousMonth(day, month, year) {
    const previousMonth = document.getElementById("previousMonth");
    previousMonth.addEventListener("click", () => {

        displayMonth--;

        if (displayMonth < 0) {
            displayMonth = 11;
            displayYear--;
        }

        createCalendar(day, displayMonth, displayYear);
    });
}

function clickNextMonth(day, month, year) {
    const nextMonth = document.getElementById("nextMonth");
    nextMonth.addEventListener("click", () => {

        displayMonth++;

        if (displayMonth > 11) {
            displayMonth = 0;
            displayYear++;
        }

        createCalendar(day, displayMonth, displayYear);
    });
}

// ########## CREATORS ########## //

async function createRandomWikiEvent(day, month) {
    let ul = document.getElementById("ul");
    ul.innerHTML = "";
    day = String(day).padStart(2, "0");
    month = String(month).padStart(2, "0");
    const url = `https://api.wikimedia.org/feed/v1/wikipedia/de/onthisday/all/${month}/${day}`

    try {
        const response = await fetch(url);
        const data = await response.json();

        random = createAndSortRandomNumbers(data.events.length);

        for (let i = 0; i < 5; i++) {
            let li = document.createElement("li");
            li.textContent = `${data.events[random[i]].year}: ${data.events[random[i]].text}`;
            ul.appendChild(li);
        }

    } catch (error) {
        let li = document.createElement("li");
        li.textContent = "Oopsi! Fehler beim Laden der historischen Ereignisse.";
        ul.appendChild(li);
        console.log(`Fehler: ${error}`);
    }
}

// erstellt die historischen Events aus der Wikipedia API - aufwändige Parser-Methode, wurde mit createRandomWikiEvents ersetzt
/* async function createRandomWikiEventDOMParser(day, month) {
    let ul = document.getElementById("ul");
    month = getMonthsName(month);
    const url = `https://de.wikipedia.org/w/api.php?action=parse&page=${day}._${month}&prop=text&format=json&origin=*`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        const html = data.parse.text["*"]; // speichert den HTML Inhalt als String
        const parser = new DOMParser(); // erstellt einen neuen DOMParser
        const wikiDOM = parser.parseFromString(html, "text/html"); // macht aus dem HTML String ein DOM
        const politicsHeadline = wikiDOM.getElementById("Politik_und_Weltgeschehen"); // holt sich den für uns wichtigen Startpunkt im DOM
        let currentElement = politicsHeadline.parentElement.nextElementSibling; // geht zum (vermutlich) ersten Listenreiter im DOM

        let allEntries = [];

        // füllt allEntries[] mit allen Einträgen von heute
        while (!currentElement.classList.contains("mw-heading")) {
            const entries = currentElement.querySelectorAll("li");
            allEntries.push(...entries);
            currentElement = currentElement.nextElementSibling;
        }

        let randomNumbers = createAndSortRandomNumbers(allEntries.length);

        for (let i = 0; i < 5; i++) {
            let li = document.createElement("li");
            li.textContent = allEntries[randomNumbers[i]].textContent;
            ul.appendChild(li);
        }
        
    } catch (error) {
        let li = document.createElement("li");
        li.textContent = "Oopsi! Fehler beim Laden der historischen Ereignisse.";
        ul.appendChild(li);
        console.log(`Fehler: ${error}`);
    }

} */

//erstellt die historischen Events aus der Muffinseite - wird aktuell nicht aufgerufen
/* function createMuffinEvents(day, month) {
    let ul = document.getElementById("ul");

    fetch(`https://history.muffinlabs.com/date/${month}/${day}`)
        .then((response) => response.json())
        .then((json) => {
            for (i = 5; i > 0; i--) {
                let li = document.createElement("li");
                li.textContent = `${json.data.Events[json.data.Events.length - i].year}: ${json.data.Events[json.data.Events.length  - i].text}`;
                ul.appendChild(li);
            }
        })
        .catch((error) => {
            console.log("Fehler:", error);
            let li = document.createElement("li");
            li.textContent = "Fehler beim Laden der historischen Events.";
            ul.appendChild(li);
        });
} */

//passt den Kalender auf den aktuellen Monat an, setzt ein Highlight am aktuellen Tag und markiert Samstage und Sonntage in einem etwas dunkeleren Farbton
function createCalendar(day, month, year) {
    let tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    let monthStart = new Date(year, month, 1).getDay();
    let daysBeforeFirst = (monthStart + 6) % 7;
    let runner = 1;
    let rowCount;

    const tableHeadline = document.getElementById("tableHeadline");
    tableHeadline.textContent = getMonthsName(month);

    while (monthStart < 0) {
        monthStart += 7;
    }

    rowCount = (Math.ceil((daysBeforeFirst + getNumberOfDays(month, year)) / 7)) - 1;

    for (let i = 0; i <= rowCount; i++) {
        let tr = document.createElement("tr");

        for (let j = 0; j < 7; j++) {
            let td = document.createElement("td");
            if (j == daysBeforeFirst && i == 0) {
                td.textContent = 1;
                td.addEventListener("click", () => {
                    date = new Date(`${year}-${month + 1}-${parseInt(td.textContent)}`);
                    initialize(date.getDate(), month, year);
                });
                runner++;
                if (monthStart == 0) {
                    td.className = "sundays"; // Highlighted Sonntage
                } else if (monthStart == 6) td.className = "saturdays"; // Highlighted Samstage
            } else if (runner > 1 && runner <= getNumberOfDays(month, year)) {
                td.textContent = runner;
                td.addEventListener("click", () => {
                    date = new Date(`${year}-${month + 1}-${parseInt(td.textContent)}`);
                    initialize(date.getDate(), month, year);
                });
                if (j == 6) {
                    td.className = "sundays"; // Highlighted Sonntage
                } else if (j == 5) td.className = "saturdays"; // Highlighted Samstage
                runner++;
            }
            if (date.getDate() == td.textContent && month == date.getMonth() && year == date.getFullYear()) {
                td.className = "highlight"; // Highlighted den aktuellen Tag
            }
            if (isHoliday(td.textContent, month + 1, year) == "ein") {
                td.className = "isHoliday"; // Highlighted Feiertage
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
}

// ########## GETTER ########## //

function getNumberOfDays(month, year) {
    const numberOfDays = [
        31, 
        isLeapYear(year) ? 29 : 28, 
        31, 
        30, 
        31, 
        30, 
        31, 
        31, 
        30, 
        31, 
        30, 
        31
    ];
    return numberOfDays[month];
}

function getMonthsName(month) {
    const months = [
        "Januar", 
        "Februar", 
        "Maerz", 
        "April", 
        "Mai", 
        "Juni", 
        "Juli", 
        "August", 
        "September", 
        "Oktober", 
        "November", 
        "Dezember"
    ];
    return months[month];
}

function getTodaysDate(day, month, year) {
    return String(day).padStart(2, "0") + "." + String(month + 1).padStart(2, "0") + "." + year; //speichert den heutigen Tag im Format XX.XX.XXXX in dateToday
}

//rechnet aus der wievielte Wochentag heute diesen Monat ist
function getNumberOfWeekdays(day) {
    const numberOfWeekdays = ["erste", "zweite", "dritte", "vierte", "fünfte"];
    if (day % 7 == 0) {
        return numberOfWeekdays[Math.floor((day / 7)) - 1];
    } else return numberOfWeekdays[Math.floor((day / 7))];
}

// ########## WRITER ########## //

function writeTitle(day, month, year) {
    const title = document.getElementById("title");
    title.textContent = "Kalenderblatt vom " + getTodaysDate(day, month, year);
}

function writeHeadline(day, month, year) {
    const headline = document.getElementById("main-headline");
    headline.textContent = "KaLeNderbLatt vom " + getTodaysDate(day, month, year);
}

function writeText(day, month, year) {
    const dayTodayElements = document.getElementsByClassName("dayToday");
    for (let i = 0; i < dayTodayElements.length; i++) dayTodayElements[i].textContent = String(day).padStart(2, "0");
    const monthStringElements = document.getElementsByClassName("monthString");
    for (let i = 0; i < monthStringElements.length; i++) monthStringElements[i].textContent = getMonthsName(month);
    const thisYearElements = document.getElementsByClassName("year");
    for (let i = 0; i < thisYearElements.length; i++) thisYearElements[i].textContent = year;
    const weekdayTodayElements = document.getElementsByClassName("weekdayToday");
    for (let i = 0; i < weekdayTodayElements.length; i++) weekdayTodayElements[i].textContent = date.toLocaleDateString("de-DE", {weekday: "long"});
    const weekdayCount = document.getElementById("weekdayCount");
    weekdayCount.textContent = getNumberOfWeekdays(day);
    const xDayOfTheYear = document.getElementById("xDayOfTheYear");
    xDayOfTheYear.textContent = calcDayOfTheYear(day, month, year);
    const xDaysRemaining = document.getElementById("xDaysRemaining");
    xDaysRemaining.textContent = calcDaysRemaining(day, month, year);
    const daysThisMonth = document.getElementById("daysThisMonth");
    daysThisMonth.textContent = getNumberOfDays(month, year);
    const holidayToday = document.getElementById("holidayToday");
    holidayToday.textContent = isHoliday(day, month + 1, year);
}

// ########## HELPER ########## //

//prüft ob ein Jahr ein Schaltjahr ist
function isLeapYear(year) {
    if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        return true;
    } else return false;
}


//prüft ob heute ein gesetzlicher Feiertag ist
function isHoliday(day, month, year) {
    let isHoliday;
    let easter = calcEaster(year);
    let goodFriday = calcHolidays(-2, year);
    let easterMonday = calcHolidays(1, year);
    let ascensionOfChrist = calcHolidays(40, year);
    let whitMonday = calcHolidays(51, year);
    let corpusChristi = calcHolidays(60, year);
    
    let holidays = [[1, 1], [easter[1], easter[0]], [goodFriday[1], goodFriday[0]], [easterMonday[1], easterMonday[0]], [ascensionOfChrist[1], ascensionOfChrist[0]], 
    [whitMonday[1], whitMonday[0]], [corpusChristi[1], corpusChristi[0]], [3, 10], [25, 12], [26, 12]];

    for (let i = 0; i < holidays.length; i++) {
        if (day == holidays[i][0] && month == holidays[i][1]) {
            return isHoliday = "ein";
        }
    }
    
    return isHoliday = "kein";
}

// erstellt random Zahlen in einem Array, eliminiert doppelt-vorkommende Zahlen und sortiert es von klein nach groß
function createAndSortRandomNumbers(size) {
    let randomArray = [];

    for (let i = 0; i < 5; i++) {
            randomArray[i] = Math.floor(Math.random() * size);
        }

        let duplicate = true;

        while (duplicate) {
            duplicate = false

            for (let i = 0; i < randomArray.length - 1; i++) {
                let temporary;
                for (let j = i; j < randomArray.length; j++) {
                    if (randomArray[i] < randomArray[j]) {
                        temporary = randomArray[i]
                        randomArray[i] = randomArray[j]
                        randomArray[j] = temporary;
                    }
                }
        }

            for (let i = 0; i < randomArray.length - 1; i++) {
                if (randomArray[i] == randomArray[i + 1]) {
                    randomArray[i + 1] = Math.floor(Math.random() * size);
                    duplicate = true;
                }
            }
        }
    
    return randomArray;
}

// ########## CALCULATORS ########## //

//rechnet aus der wievielte Tag des Jahres heute ist
function calcDayOfTheYear(day,month, year) {
    let days = day;
    for (let i = 0; i < month; i++) {
        days += getNumberOfDays(month, year);
    }
    return days;
}
//rechnet aus wieviele Tage dieses Jahr noch hat
function calcDaysRemaining(day, month, year) {
    let remaining;
    if (isLeapYear(year)) {
        remaining = 366;
    } else remaining = 365;
    return remaining -= calcDayOfTheYear(day, month, year);
}

function calcEaster(year) {
    let a = year % 19;
    let b = Math.floor(year / 100);
    let c = year % 100;
    let d = Math.floor(b / 4);
    let e = b % 4;
    let f = Math.floor((b + 8) / 25);
    let g = Math.floor((b - f + 1) / 3);
    let h = (19 * a + b - d - g + 15) % 30;
    let i = Math.floor(c / 4);
    let k = c % 4;
    let l = (32 + 2 * e + 2 * i - h - k) % 7;
    let m = Math.floor((a + 11 * h + 22 * l) / 451);

    let month = Math.floor((h + l - 7 * m + 114) / 31);
    let day = ((h + l - 7 * m + 114) % 31) + 1;

    let easterMonthDay = [month, day];
    return easterMonthDay;
}

function calcHolidays(addend, year) {
    let holiday = calcEaster(year);
    holiday[1] += addend;
    if (addend > 0) {
        while (holiday[1] > getNumberOfDays(holiday[0], year)) {
            holiday[1] -= getNumberOfDays(holiday[0], year);
            holiday[0]++;
        }
    } else {
        while (holiday[1] < 1) {
            holiday[1] += getNumberOfDays(holiday[0], year);
            holiday[0]--;
        }
    }
    return holiday;
}