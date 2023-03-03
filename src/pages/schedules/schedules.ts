import Page from '../../core/templates/page';
import './schedules.css';
import { renderBackground } from '../../core/components/background-video';
import Video from '../../assets/video/hoyenelparque_cabecera-video.mov';
import { schedulesExplEng } from '../../utils/schedulesData';
import { createSchedulesTable } from '../../core/components/schedulesTable';
import { schedulesTableData } from '../../utils/schedulesData';
import { schedulesTableDataRu } from '../../utils/schedulesData';
import { schedulesSaturdayData } from '../../utils/schedulesData';
import { schedulesSaturdayDataRu } from '../../utils/schedulesData';
import { createCalendarView } from '../../core/components/create-calendar-schedules';
import { getAllSaturdays } from '../../core/components/create-calendar-schedules';
import { highlightCell } from '../../utils/highlightCells';
import { langArr } from '../../utils/dataLang';
import { LanguageArr } from '../../utils/types';

class SchedulesPage extends Page {
    static TextObject = {
        MainTitle: 'Schedules Page',
    };

    constructor(id: string) {
        super(id);
    }

    render() {
        const select = <HTMLSelectElement>document.querySelector('.header_language');
        if (select.value === 'ru') {
            let langInHash = window.location.hash.slice(1).split('=')[1];
            langInHash = select.value;
            const path = window.location.hash.slice(1).split('=')[0];
            const url = new URL(window.location.toString());
            url.hash = path + '=' + langInHash;
            window.history.pushState({}, '', url);
            select.value = 'ru';
        }

        const saturdays = getAllSaturdays();

        const content = document.createElement('div');
        content.classList.add('schedules__content');

        const tiles = document.createElement('div');
        tiles.classList.add('tile');
        const tilesLayout = `
        <div class="schedules-tile_left">AQUARIUM TODAY</div>
        <div class="schedules-tile_right">Check the activity schedules for today.
        <br>On Sunday, 5th febrary, Oceanogràfic hosts the final of the stage of La Volta a la Comunitat Valenciana.
        <br>Throughout the day, we will have free activities in the access square. For this reason, the aquarium parking will remain closed, but you can park your car in the vicinity of the enclosure or come by public transport.</div>`;

        tiles.innerHTML = tilesLayout;
        const information = document.createElement('div');
        information.classList.add('tickets__wrapper');
        information.innerHTML = `<div class="schedules__buttons-top">
        <button class="schedules__button-right">Calendar
        </button>
        <div class="schedules__calendar-container">
        <div class="schedules__calendar"></div>
        </div>
    </div>
    <div>
    <div class="sched-table__cell">
    <div class="sched-table__hour">Hour</div>
    <div class="sched-table__activity">Activity</div>
    <div class="sched-table__location">Location</div>
    <div class="sched-table__status">Status</div>
</div>
<div class="schedules__table"></div>
    </div>
    <div class="schedules__explanation">${schedulesExplEng}</div>
`;

        content.append(tiles, information);
        this.container.append(renderBackground(Video), content);

        //___________________________________________________переключение на другой язык
        if (select.value === 'ru') {
            for (const key in langArr) {
                if (this.container.querySelector('.' + key)) {
                    this.container.querySelector('.' + key)!.innerHTML =
                        langArr[key as keyof LanguageArr][select.value as keyof { ru: string; en: string }];
                }
            }
        }
        //________________________________________________________________________________

        const schedulesTable = <HTMLDivElement>this.container.querySelector('.schedules__table');
        if (saturdays.includes(new Date().getDate())) {
            if (select.value === 'ru') {
                schedulesTable.append(createSchedulesTable(schedulesSaturdayDataRu));
            } else {
                schedulesTable.append(createSchedulesTable(schedulesSaturdayData));
            }
        } else {
            if (select.value === 'ru') {
                schedulesTable.append(createSchedulesTable(schedulesTableDataRu));
            } else {
                schedulesTable.append(createSchedulesTable(schedulesTableData));
            }
        }

        const buttonToCalendar = <HTMLButtonElement>this.container.querySelector('.schedules__button-right');
        const calendarContainer = <HTMLDivElement>this.container.querySelector('.schedules__calendar-container');

        const calendarWrapper = <HTMLDivElement>this.container.querySelector('.schedules__calendar');
        calendarContainer.classList.add('hidden');

        createCalendarView(calendarWrapper, select.value);

        buttonToCalendar.addEventListener('click', () => {
            calendarContainer.classList.toggle('hidden');
        });

        const td = <HTMLCollectionOf<HTMLTableCellElement>>calendarWrapper.getElementsByTagName('td');

        for (const elem of td) {
            elem.addEventListener('click', () => {
                if (elem.className !== 'td__pastDay') {
                    highlightCell(td);
                    schedulesTable.innerHTML = '';
                    if (saturdays.includes(Number(elem.textContent))) {
                        if (select.value === 'ru') {
                            schedulesTable.append(createSchedulesTable(schedulesSaturdayDataRu));
                        } else {
                            schedulesTable.append(createSchedulesTable(schedulesSaturdayData));
                        }
                    } else {
                        if (select.value === 'ru') {
                            schedulesTable.append(createSchedulesTable(schedulesTableDataRu));
                        } else {
                            schedulesTable.append(createSchedulesTable(schedulesTableData));
                        }
                    }
                }
            });
        }

        window.addEventListener('load', () => {
            content.classList.add('schedules__toTop');
        });

        return this.container;
    }
}

export default SchedulesPage;
