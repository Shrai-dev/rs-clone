export function createCalendar(elem: HTMLDivElement) {

    let dayMonthCurrent = new Date().getDate();
    let yearCurrent = new Date().getFullYear();
    let monthCurrent = new Date().getMonth();

    var d = new Date(yearCurrent, monthCurrent);

    let table = '<table><tr><th>Mo</th><th>Tu</th><th>We</th><th>Th</th><th>Fr</th><th>Sa</th><th>Su</th></tr><tr>';


    // заполнить первый ряд от понедельника
    // и до дня, с которого начинается месяц
    // * * * | 1  2  3  4
    for (var i = 0; i < getDay(d); i++) {
        table += '<td></td>';
    }

    // ячейки календаря с датами
    while (d.getMonth() == monthCurrent) {

        table += '<td>' + d.getDate() + '</td > ';



        if (getDay(d) % 7 == 6) { // вс, последний день - перевод строки
            table += '</tr><tr>';
        }

        d.setDate(d.getDate() + 1);
    }

    // добить таблицу пустыми ячейками, если нужно
    if (getDay(d) != 0) {
        for (var i = getDay(d); i < 7; i++) {
            table += '<td></td>';
        }
    }
    // закрыть таблицу
    table += '</tr></table>';

    elem.innerHTML = table;


    const calendarTable = <HTMLCollectionOf<HTMLTableElement>>elem.getElementsByTagName('table');
    for (let item of calendarTable) {
        item.classList.add('sched-calendar__table')
    }


    const td = <HTMLCollectionOf<HTMLTableCellElement>>elem.getElementsByTagName('td');

    for (let item of td) {
        if (item.textContent === `${dayMonthCurrent}`) {
            item.classList.add('td__highlight');
            item.classList.add('td__futureDay')
        } else if (Number(item.textContent) < dayMonthCurrent && item.textContent) {
            item.classList.add('td__pastDay')
        } else if (Number(item.textContent) > dayMonthCurrent && item.textContent) {
            item.classList.add('td__futureDay')
        }
    }
}

function getDay(date: Date) { // получить номер дня недели, от 0(пн) до 6(вс)
    let day = date.getDay();
    if (day == 0) day = 7;
    return day - 1;
}

export function getAllSaturdays() {

    let year = new Date().getFullYear()
    var month = new Date().getMonth()

    var saturdays = [];

    for (let i = 0; i <= new Date(year, month, 0).getDate(); i++) {
        let date = new Date(year, month, i);

        if (date.getDay() == 6) {
            saturdays.push(date.getDate());
        }
    };
    return saturdays;
}


export function createCalendarView(elem: HTMLDivElement) {

    const monthName: string = new Date().toLocaleString('en', {
        month: 'long'
    });

    const year = new Date().getFullYear();

    const monthContainer = document.createElement('div');
    monthContainer.classList.add('sched-calendar__month-container');

    const monthNameContainer = document.createElement('h3');
    monthNameContainer.classList.add('calendar__monthName');
    monthNameContainer.innerText = `${monthName} ${year}`;

    const calendar = document.createElement('div');
    calendar.classList.add('calendar');

    createCalendar(calendar);

    monthContainer.append(monthNameContainer);
    elem.append(monthContainer, calendar);
}
