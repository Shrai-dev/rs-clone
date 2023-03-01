import Component from '../templates/components';
import { PageIds } from '../../pages/app/app';
import { langArr } from '../../utils/dataLang';
import { data } from '../../utils/dataLang';
import { ticketsData } from '../../utils/dataBuyTicket';
import { ticketsDataRu } from '../../utils/dataBuyTicket';
import { createDropDownListTicket } from './drop-down-list';
import { createDropDownListCondition } from './drop-down-list';
import { conditionsData } from '../../utils/dataCondition';
import { conditionsDataRu } from '../../utils/dataCondition';
import { freeEntriesData } from '../../utils/dataFreeEntries';
import { freeEntriesDataRu } from '../../utils/dataFreeEntries';
import { createSchedulesTable } from './schedulesTable';
import { schedulesSaturdayData } from '../../utils/schedulesData';
import { schedulesSaturdayDataRu } from '../../utils/schedulesData';
import PricesPage from '../../pages/prices-calendar/prices';
import { createCalendarView } from './create-calendar';
import { createCalendarView as createCalendarSchedules } from './create-calendar-schedules';
import { langArrBuyTicket } from '../../utils/dataLang';
import { QuisResult } from '../../pages/personal-account/personal-account';
import { login } from '../../utils/requests';
import { registration } from '../../utils/requests';
import { goToAnotherPage } from '../../utils/goToAnotherPage';

export type LoginData = {
    email: string | null;
    name: string | null;
    surname: string | null;
    phone: string | null;
    password: string | null;
    quisResult: QuisResult | null;
};

const Buttoms: { id: string; text: string }[] = [
    {
        id: PageIds.PricesPage,
        text: 'Prices and Calendar',
    },
    {
        id: PageIds.SchedulesPage,
        text: 'Schedules',
    },
    {
        id: PageIds.QuizPage,
        text: 'Quiz',
    },
    {
        id: PageIds.CiutatPage,
        text: 'La Ciutat',
    },
    {
        id: PageIds.TicketPage,
        text: 'BUY YOUR TICKET',
    },
];
class Header extends Component {

    selectedLang: string;

    constructor(tagName: string, className: string) {
        super(tagName, className);
        this.selectedLang = "en";
    }

    createHeader() {
        const headerContainer = <HTMLDivElement>document.createElement('div');
        headerContainer.classList.add('container');

        const headerWrapper = <HTMLDivElement>document.createElement('div');
        headerWrapper.classList.add('wrapper');

        const logo = document.createElement('div');
        logo.classList.add('header__logo');

        const pageButtons: HTMLDivElement = document.createElement('div');

        pageButtons.classList.add('header__nav');
        Buttoms.forEach((button) => {
            const buttonHTML = document.createElement('a');
            buttonHTML.innerText = button.text;
            if (buttonHTML.textContent === 'La Ciutat') {
                buttonHTML.href = 'https://www.cac.es/va/home.html';
            } else {
                buttonHTML.href = `#${button.id}`;
            }
            buttonHTML.classList.add(button.id.split('&')[0]);
            if (buttonHTML.textContent === 'BUY YOUR TICKET' || buttonHTML.textContent === 'La Ciutat') {
                buttonHTML.setAttribute('target', '_blank');
            }
            pageButtons.append(buttonHTML);
        });

        const language = <HTMLSelectElement>document.createElement('select');
        language.classList.add('header_language');

        const option_language_en = <HTMLElement>document.createElement('option');
        option_language_en.classList.add('language_en');
        option_language_en.innerText = 'en';

        const option_language_ru = <HTMLElement>document.createElement('option');
        option_language_ru.classList.add('language_ru');
        option_language_ru.innerText = 'ru';

        const userAuth = <HTMLDivElement>document.createElement('div');
        userAuth.classList.add('user__auth');

        const themeToggler = <HTMLDivElement>document.createElement('div');
        themeToggler.classList.add('theme_toggler');

        const burger_menu_wrapper = <HTMLDivElement>document.createElement('div');
        burger_menu_wrapper.classList.add('burger_menu');
        burger_menu_wrapper.innerHTML = `
     <section class="top-nav">
     <input id="burger_menu" class="input_bm" type="checkbox" />
     <label class='menu-button-container' for="burger_menu">
       <div class='menu-button'></div>
     </label>
       <ul class="menu">
         <li><a class="li_bm" href="#prices-page&lang=en">Prices and Calendar</a></li>
         <li><a class="li_bm" href="#schedules-page&lang=en">Schedules</a></li>
         <li><a class="li_bm" href="#quiz-page&lang=en">Quiz</a></li>
         <li><a class="li_bm" href="#ciutat-page&lang=en">La Ciutat</a></li>
         <li><a class="li_bm" href="#ticket-page&lang=en">BUY YOUR TICKET</a></li>
         <li><a class="li_bm" href="#personal-page&lang=en">Personal accaunt</a></li>
         </ul>
     </section>
   `;

        language.append(option_language_en, option_language_ru);
        headerWrapper.append(logo, pageButtons, language, userAuth, themeToggler, burger_menu_wrapper);
        headerContainer.append(headerWrapper);
        this.container.append(headerContainer);

        const li_bm = <HTMLCollectionOf<Element>>burger_menu_wrapper.getElementsByClassName('li_bm');
        const input_bm = <HTMLInputElement>burger_menu_wrapper.getElementsByClassName('input_bm')[0];
        const top_nav = <HTMLDivElement>burger_menu_wrapper.getElementsByClassName('top-nav')[0];

        for (const el of li_bm) {
            el.addEventListener('click', () => {
                input_bm.checked = false;
            });
        }

        window.onscroll = function () {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop;
            const header = <HTMLElement>document.querySelector('.container');
            const box_language = <HTMLElement>document.querySelector('.header_language');
            const box_ticket = <HTMLElement>document.querySelector('.ticket-page');
            const userAuth = <HTMLElement>document.querySelector('.user__auth');
            const boxTheme = <HTMLElement>document.querySelector('.theme_toggler');
            const burger_menu = <HTMLDivElement>document.querySelector('.burger_menu');

            if (scrolled > 5) {
                header.style.width = '100%';
                header.style.background = '#102f43';
                header.style.position = 'fixed';
                header.style.height = '60px';
                header.style.marginTop = '0';
                header.style.zIndex = '2000';
                header.style.transition = 'all 2s ease';
                box_language.style.display = 'none';
                box_ticket.style.opacity = '1';
                boxTheme.style.display = 'none';
                userAuth.style.display = 'none';
                burger_menu.style.display = 'grid';
                burger_menu.style.width = '50px';
                top_nav.style.marginLeft = '58vw';
                headerWrapper.style.gridTemplateColumns = "1fr 5fr";
            }
            if (0 >= scrolled) {
                header.style.background = 'none';
                box_language.style.display = 'grid';
                box_ticket.style.opacity = '1';
                boxTheme.style.display = 'block';
                userAuth.style.display = 'block';
                burger_menu.style.display = 'grid';
                top_nav.style.marginLeft = '0';
                headerWrapper.style.gridTemplateColumns = "1fr 1fr 1fr 1fr 1fr";
            }
        };

        themeToggler.addEventListener('click', (e: MouseEvent) => {
            const toggler = <HTMLDivElement>e.target;
            const body = <HTMLBodyElement>document.querySelector('body');

            const currentPageHash = window.location.hash.slice(1);

            const information = <HTMLElement>document.querySelector('.information');
            const pricesRightTile = <HTMLElement>document.querySelector('.tile_right');
            const tickets = <HTMLElement>document.querySelector('.tickets');
            const experiences = <HTMLElement>document.querySelector('.oceanographic-experiences');
            const conditions = <HTMLElement>document.querySelector('.conditions');
            const freeEntries = <HTMLElement>document.querySelector('.free-entries');

            const schedulesContent = <HTMLElement>document.querySelector('.schedules__content');
            const schedulesRightTile = <HTMLElement>document.querySelector('.schedules-tile_right');
            const schedulesTickets = <HTMLElement>document.querySelector('.tickets__wrapper');

            const quizTasks = <HTMLElement>document.querySelector('.tasks');
            const headerQuizContainer = <HTMLElement>document.querySelector('.containerHeaderQuiz');
            const btnQuiz = <HTMLElement>document.querySelector('.btnQuiz');
            const liLevel = <NodeListOf<Element>>document.querySelectorAll('.liLevel');
            const liLevelActive = <HTMLElement>document.querySelector('.liLevelActiv');
            const quizBox = <NodeListOf<Element>>document.querySelectorAll('.box');
            const quizTaskBox = <NodeListOf<Element>>document.querySelectorAll('.task_box');

            const footer = <HTMLElement>document.querySelector('.footer');
            const devInfo = <HTMLElement>document.querySelector('.post-footer');


            if (toggler instanceof HTMLDivElement) {
                if (toggler.classList.contains('dark')) {
                    toggler.classList.remove('dark');
                    body.style.backgroundColor = 'transparent';
                    footer.classList.remove('dark');
                    devInfo.classList.remove('dark');
                    switch (currentPageHash) {
                        case PageIds.PricesPage:
                        case PageIds.PricesPageRu:
                        case '':
                            information.classList.remove('dark');
                            pricesRightTile.classList.remove('dark');
                            tickets.classList.remove('dark');
                            experiences.classList.remove('dark');
                            conditions.classList.remove('dark');
                            freeEntries.classList.remove('dark');
                            break;
                        case PageIds.SchedulesPage:
                        case PageIds.SchedulesPageRu:
                            schedulesContent.classList.remove('dark');
                            schedulesRightTile.classList.remove('dark');
                            schedulesTickets.classList.remove('dark');
                            break;
                        case PageIds.QuizPage:
                        case PageIds.QuizPageRu:
                            quizTasks.classList.remove('dark');
                            headerQuizContainer.classList.remove('dark');
                            btnQuiz.classList.remove('dark');
                            liLevel.forEach((item) => item.classList.remove('dark'));
                            liLevelActive.classList.remove('dark');
                            quizBox.forEach((item) => item.classList.remove('dark'));
                            quizTaskBox.forEach((item) => item.classList.remove('dark'));
                            break;
                    }
                } else {
                    toggler.classList.add('dark');
                    body.style.backgroundColor = '#102f43';
                    footer.classList.add('dark');
                    devInfo.classList.add('dark');
                    switch (currentPageHash) {
                        case PageIds.PricesPage:
                        case PageIds.PricesPageRu:
                        case '':
                            information.classList.add('dark');
                            pricesRightTile.classList.add('dark');
                            tickets.classList.add('dark');
                            experiences.classList.add('dark');
                            conditions.classList.add('dark');
                            freeEntries.classList.add('dark');
                            break;
                        case PageIds.SchedulesPage:
                        case PageIds.SchedulesPageRu:
                            schedulesContent.classList.add('dark');
                            schedulesRightTile.classList.add('dark');
                            schedulesTickets.classList.add('dark');
                            break;
                        case PageIds.QuizPage:
                        case PageIds.QuizPageRu:
                            quizTasks.classList.add('dark');
                            headerQuizContainer.classList.add('dark');
                            btnQuiz.classList.add('dark');
                            liLevel.forEach((item) => item.classList.add('dark'));
                            liLevelActive.classList.add('dark');
                            quizBox.forEach((item) => item.classList.add('dark'));
                            quizTaskBox.forEach((item) => item.classList.add('dark'));
                            break;
                    }
                }
            }
        });
    }

    render(): HTMLElement {
        this.createHeader();

        const select = <HTMLSelectElement>this.container.querySelector('.header_language');
        const langInHash = window.location.hash.slice(1).split('=')[1];
        if (langInHash) {
            select.value = langInHash;
            this.selectedLang = langInHash;
        }

        select.addEventListener('change', () => {
            if (window.location.hash.length !== 0) {
                let langInHash = window.location.hash.slice(1).split('=')[1];
                langInHash = select.value;
                this.selectedLang = select.value;
                const path = window.location.hash.slice(1).split('=')[0];
                const url = new URL(window.location.toString());
                url.hash = path + '=' + langInHash;
                window.history.pushState({}, '', url);
            }

            for (const key in langArr) {
                if (document.querySelector('.' + key)) {
                    document.querySelector('.' + key)!.innerHTML =
                        langArr[key as keyof data][select.value as keyof { ru: string; en: string }];
                }
            }

            for (const key in langArrBuyTicket) {
                document
                    .querySelectorAll('.' + key)
                    .forEach(
                        (el) =>
                            (el!.innerHTML = langArrBuyTicket[key as keyof data][select.value as keyof { ru: string; en: string }])
                    );
            }

            const ticketOptions = <HTMLDivElement>document.querySelector('.calendar__options');
            const conditionOptions = <HTMLDivElement>document.querySelector('.conditions__options');
            const freeEntriesOptions = <HTMLDivElement>document.querySelector('.free-entries__options');
            const schedulesTable = <HTMLDivElement>document.querySelector('.schedules__table');
            const calendar = <HTMLDivElement>document.querySelector('.calendar');
            const calendarWrapper = <HTMLDivElement>document.querySelector('.schedules__calendar');

            if (select.value === 'ru') {
                document.querySelector('title')!.innerHTML = 'RS Клон';

                if (ticketOptions) {
                    ticketOptions!.innerHTML = '';
                    for (const elem of ticketsDataRu) {
                        ticketOptions!.append(createDropDownListTicket(elem));
                    }
                }

                if (conditionOptions) {
                    conditionOptions.innerHTML = '';
                    conditionOptions.append(createDropDownListCondition(conditionsDataRu));
                }

                if (freeEntriesOptions) {
                    freeEntriesOptions.innerHTML = '';
                    freeEntriesOptions.append(createDropDownListCondition(freeEntriesDataRu));
                }
                if (schedulesTable) {
                    schedulesTable.innerHTML = '';
                    schedulesTable.append(createSchedulesTable(schedulesSaturdayDataRu));
                }
                if (calendar) {
                    calendar.innerHTML = '';
                    createCalendarView(calendar, 2023, PricesPage.currentMonth, select.value);
                }
                if (calendarWrapper) {
                    calendarWrapper.innerHTML = '';
                    createCalendarSchedules(calendarWrapper, select.value);
                }
            } else {
                document.querySelector('title')!.innerHTML = 'RS Clone';

                if (ticketOptions) {
                    ticketOptions!.innerHTML = '';
                    for (const elem of ticketsData) {
                        ticketOptions!.append(createDropDownListTicket(elem));
                    }
                }

                if (conditionOptions) {
                    conditionOptions.innerHTML = '';
                    conditionOptions.append(createDropDownListCondition(conditionsData));
                }

                if (freeEntriesOptions) {
                    freeEntriesOptions.innerHTML = '';
                    freeEntriesOptions.append(createDropDownListCondition(freeEntriesData));
                }
                if (schedulesTable) {
                    schedulesTable.innerHTML = '';
                    schedulesTable.append(createSchedulesTable(schedulesSaturdayData));
                }
                if (calendar) {
                    calendar.innerHTML = '';
                    createCalendarView(calendar, 2023, PricesPage.currentMonth, select.value);
                }
                if (calendarWrapper) {
                    calendarWrapper.innerHTML = '';
                    createCalendarSchedules(calendarWrapper, select.value);
                }
            }
        });

        const userAuth = <HTMLDivElement>this.container.querySelector('.user__auth');

        userAuth.addEventListener('click', () => {
            if (localStorage.getItem("user") !== null) {
                this.showExitForm();
            } else {
                this.showRegistrationForm();
            }
        });

        return this.container;
    }

    showRegistrationForm() {
        const overlay = <HTMLDivElement>document.createElement('div');
        overlay.classList.add('overlay');

        const modalContainer = <HTMLDivElement>document.createElement('div');
        modalContainer.classList.add('modal__container');

        modalContainer.innerHTML = `<div class="login-form">
        <form class='authorization__form'>
            <div class='authorization__wrapper'>
                <h3 class='authorization__title'>Login</h3>
                <input class='authorization__input input input-e-mail' id='e-mail' type='text' placeholder='Enter e-mail...'>
                <input class='authorization__input input input-password' id='password' type='password' placeholder='Enter password...'>
            </div>
        </form>
        <p class='authorization__disclaimer'>
            If you don't have an account, you can <button class='link register__link' href=''>register</button>
        </p>
        <p class='authorization__incorrect hidden'>
            Incorrect e-mail or password
        </p>
    </div>
    <div class="registration-form hidden">
        <form class='authorization__form'>
            <div class='authorization__wrapper'>
                <h3 class='authorization__title'>Register</h3>
                <input class='authorization__input input register__input-e-mail' id='e-mail' type='text' placeholder='Enter e-mail...'>
                <input class='authorization__input input register__input-name' id='name' type='text' placeholder='Enter name...'>
                <li class='authorization__rules-text'>The name should have more than 3 letters</li>
                <input class='authorization__input input register__input-surname' id='surname' type='text' placeholder='Enter surname...'>
                <li class='authorization__rules-text'>The name should have more than 3 letters</li>
                <input class='authorization__input input register__input-phone' id='phone' type='tel' placeholder='Enter phone number...'">
                <li class='authorization__rules-text'>The phone number should start from "+" and have 9 - 12 numbers</li>
                <input class='authorization__input input register__input-password' id='password' type='password' placeholder='Enter password...'>
                <li class='authorization__rules-text'>The password should be from 4 to 14 characters and have at least 1 number, 1 upper case letter, 1 lower case letter</li>
            </div>
        </form>
        <p class='registration__incorrect hidden'>
        A user with this e-mail exists
        </p>
    </div>`;

        const loginForm = <HTMLDivElement>modalContainer.querySelector('.login-form');
        const registrationForm = <HTMLDivElement>modalContainer.querySelector('.registration-form');
        const incorrectMessage = <HTMLParagraphElement>modalContainer.querySelector('.authorization__incorrect');
        const incorrectRegisterMessage = <HTMLParagraphElement>modalContainer.querySelector('.registration__incorrect');

        const loginBtn = <HTMLButtonElement>document.createElement('button');
        loginBtn.classList.add('button', 'login__button');
        loginBtn.setAttribute('type', 'submit');
        loginBtn.innerText = 'Login';

        const registerBtn = <HTMLButtonElement>document.createElement('button');
        registerBtn.classList.add('button', 'register__button');
        registerBtn.setAttribute('type', 'submit');
        registerBtn.innerText = 'Register';

        modalContainer.append(loginBtn);

        const loginData: LoginData = {
            email: null,
            name: null,
            surname: null,
            phone: null,
            password: null,
            quisResult: null
        };

        const email = <HTMLInputElement>modalContainer.querySelector('.input-e-mail');
        const password = <HTMLInputElement>modalContainer.querySelector('.input-password');
        const emailRegistr = <HTMLInputElement>modalContainer.querySelector('.register__input-e-mail');
        const passwordRegistr = <HTMLInputElement>modalContainer.querySelector('.register__input-password');
        const nameUser = <HTMLInputElement>modalContainer.querySelector('.register__input-name');
        const surnameUser = <HTMLInputElement>modalContainer.querySelector('.register__input-surname');
        const phoneUser = <HTMLInputElement>modalContainer.querySelector('.register__input-phone');

        email.addEventListener('change', () => {
            loginData.email = email.value;
        });

        emailRegistr.addEventListener('change', () => {
            loginData.email = emailRegistr.value;
        });

        nameUser.addEventListener('change', () => {
            loginData.name = nameUser.value;
        });

        surnameUser.addEventListener('change', () => {
            loginData.surname = surnameUser.value;
        });

        phoneUser.addEventListener('change', () => {
            loginData.phone = phoneUser.value;
        });

        password.addEventListener('change', () => {
            loginData.password = password.value;
        });

        passwordRegistr.addEventListener('change', () => {
            loginData.password = passwordRegistr.value;
        });

        loginBtn.addEventListener('click', async () => {
            const response = await login(loginData)

            if (response.ok) {
                const responseJson = await response.json();
                const { accessToken, user } = responseJson;
                localStorage.accessToken = accessToken;
                if (user !== null) {
                    localStorage.user = JSON.stringify(user);
                }
                goToAnotherPage(PageIds.PersonalAccauntPage);

            } else {
                incorrectMessage.classList.remove('hidden');
            }
        });

        const registerLink = <HTMLButtonElement>modalContainer.querySelector('.register__link');

        registerLink.addEventListener('click', () => {
            loginForm.classList.add('hidden');
            registrationForm.classList.remove('hidden');
            loginBtn.remove();
            modalContainer.append(registerBtn);
        });

        registerBtn.addEventListener('click', async () => {
            const formInputs = <NodeListOf<HTMLInputElement>>registrationForm.querySelectorAll('input');
            const emptyInputs = Array.from(formInputs).filter((input) => input.value === '');
            const nameRegistrValue = nameUser.value;
            const surnameRegistrValue = surnameUser.value;
            const phoneRegistrValue = phoneUser.value;
            const passwordRegistrValue = passwordRegistr.value;

            const nameRegExp = /^[A-Za-z]{3,12}$/;
            const phoneRegExp = /^\+[0-9]{9,12}$/;
            const passwordRegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,14}$/;

            formInputs.forEach((input) => {
                if (input.value === '') {
                    input.classList.add('error');
                } else {
                    input.classList.remove('error');
                }
            });

            if (emptyInputs.length !== 0) {
                return false;
            }

            if (!nameRegExp.test(nameRegistrValue)) {
                nameUser.classList.add('error');
                return false;
            } else {
                nameUser.classList.remove('error');
            }

            if (!nameRegExp.test(surnameRegistrValue)) {
                surnameUser.classList.add('error');
                return false;
            } else {
                surnameUser.classList.remove('error');
            }

            if (!phoneRegExp.test(phoneRegistrValue)) {
                phoneUser.classList.add('error');
                return false;
            } else {
                phoneUser.classList.remove('error');
            }

            if (!passwordRegExp.test(passwordRegistrValue)) {
                passwordRegistr.classList.add('error');
                return false;
            } else {
                passwordRegistr.classList.remove('error');
            }

            const response = await registration(loginData);

            if (response.ok) {
                const responseJson = await response.json();
                const { accessToken, user } = responseJson;
                localStorage.accessToken = accessToken;
                if (user !== null) {
                    localStorage.user = JSON.stringify(user);
                }

                goToAnotherPage(PageIds.PersonalAccauntPage)

            } else {
                incorrectRegisterMessage.classList.remove('hidden');
            }
        });

        document.body.style.overflow = 'hidden';
        document.body.prepend(overlay);
        document.body.append(modalContainer);

        const closeModal = (): void => {
            modalContainer.remove();
            overlay.remove();
            document.body.style.overflowY = 'scroll';
        };

        overlay.addEventListener('click', closeModal);
    }

    showExitForm() {
        const overlay = <HTMLDivElement>document.createElement('div');
        overlay.classList.add('overlay');

        const exitContainer = <HTMLDivElement>document.createElement('div');
        exitContainer.classList.add('exit__container');

        exitContainer.innerHTML = `
        <button class="toAccount__button">To account</button>
        <button class="exit__button">Exit</button>`;

        document.body.style.overflow = 'hidden';
        document.body.prepend(overlay);
        document.body.append(exitContainer);

        const exitBtn = <HTMLButtonElement>exitContainer.querySelector('.exit__button');
        exitBtn.addEventListener('click', () => {
            window.localStorage.clear();

            this.selectedLang === "ru" ? goToAnotherPage(PageIds.PricesPageRu) : goToAnotherPage(PageIds.PricesPage);

        });

        const toAccountBtn = <HTMLButtonElement>exitContainer.querySelector('.toAccount__button');
        toAccountBtn.addEventListener('click', () => {
            goToAnotherPage(PageIds.PersonalAccauntPage)
        });

        const closeModal = (): void => {
            exitContainer.remove();
            overlay.remove();
            document.body.style.overflowY = 'scroll';
        };

        overlay.addEventListener('click', closeModal);
    }
}

export default Header;
