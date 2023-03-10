import Page from '../../core/templates/page';
import './buy-ticket.css';
import { createInputCalendar } from '../../core/components/create-calendar-tickets';
import { createOptionByuingTicket } from '../../core/components/optionsBuyingTickets';
import { onlineTicketsData } from '../../utils/dataOnlineTickets';
import { addCardLogo } from '../../core/components/addCardLogo';
import CardLogo from '../../assets/icons/card-logo.png';
import AmericanExpr from '../../assets/icons/american-express.svg';
import Mastercard from '../../assets/icons/mastercard.svg';
import Visa from '../../assets/icons/visa.png';
import UnionPay from '../../assets/icons/union-pay.png';
import { langArr, langArrBuyTicket, langArrHeaderFooter } from '../../utils/dataLang';
import { PageIds } from '../../utils/types';
import App from '../app/app';
import { addTicketToAccount } from '../../utils/requests';
import { goToAnotherPage } from '../../utils/goToAnotherPage';
import { switchValueLanguageInHash } from '../../utils/switchValueLangInHash';
import { translateToAnotherLang } from '../../utils/translateToAnotherlanguage';
import { messageAfterTcketBuying } from '../../utils/canvas';

export class TicketPage extends Page {
    static TextObject = {
        MainTitle: 'Ticket Page',
    };
    static date: string;

    constructor(id: string) {
        super(id);
        TicketPage.date = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(
            new Date().getDate()
        ).padStart(2, '0')}`;
    }

    render() {
        const select = <HTMLSelectElement>document.querySelector('.header_language');

        switchValueLanguageInHash(select);

        const background = document.createElement('div');
        background.classList.add('buy-ticket__backg');
        const buyingTicketContainer = document.createElement('div');
        buyingTicketContainer.innerHTML = `<div class="tickets__container">
        <div class="tickets__wrapper">
            <div class="tickets__nav">
                <button class="selection__button tickets__buttons_filed">Select your tickets</button>
                <button disabled class="registration__button">Make a purchase</button>
                <button disabled class="payment__button">Payment</button>
            </div>
            <div class="progress"></div>
            <div class="tickets__selection">
                <div class="selection__calendar">
                </div>
                <div class="selection__warning">Select your entry time for Oceanogr??fic Val??ncia. You can enter Oceanogr??fic Val??ncia from the time selected.</div>
                <div class="selection">
                    <div class=${TicketPage.date}></div>
                </div>
                <div class="selection__tickets-container"></div>
            </div>
            <div class="tickets__registration hidden">

            <div class="registration__input-container">
              <label class="registration__label label_name" for="name">Enter your name</label>
              <input class="registration__input reg__input-name" type="text" id="name" required minlength="2" maxlength="20" pattern="[a-zA-Z??-????-??????]+">
            </div>
            <div class="registration__input-container">
              <label class="registration__label label_surname" for="surname">Enter your surname</label>
              <input class="registration__input reg__input-surname" type="text" id="surname" required minlength="2" maxlength="20" pattern="[a-zA-Z??-????-??????]+">
            </div>
            <div class="registration__input-container">
                <label class="registration__label label_phone" for="phone">Enter your phone</label>
                <input class="registration__input reg__input-phone" type="tel" id="phone" required pattern="[+][0-9]{3}[0-9]{2}[0-9]{7}" placeholder="+375291234567">
            </div>
            <div class="registration__input-container">
              <label class="registration__label label_e-mail" for="t2">Enter your e-mail address</label>
              <input class="registration__input reg__input-email" type="email" id="t2" name="email" required>
            </div>

            </div>
            <div class="ticket__payment hidden">
                <p class="payment__title">Credit card details</p>
                <div class="payment__card-form">
                    <div class="payment__input-container">
                        <label for="ccn" class="payment__label label_card-number">Credit Card Number:</label>
                        <input id="ccn" class="ccn payment__input" type="tel" inputmode="numeric" pattern="[0-9\s]{4}[ ][0-9\s]{4}[ ][0-9\s]{4}[ ][0-9\s]{4}" autocomplete="cc-number" maxlength="19" required placeholder="xxxx xxxx xxxx xxxx">
                        <div class="payment__container-card-img">
                        </div>
                    </div>
                    <div class="payment__input-container">
                        <label for="valid" class="payment__label label_valid">Valid:</label>
                        <input id="valid" class="valid payment__input" type="tel" inputmode="numeric" pattern="[0-9\s]{2}[/][0-9\s]{2}" autocomplete="cc-number" required maxlength="5" placeholder="Valid Thru">
                    </div>
                    <div class="payment__input-container">
                        <label for="cvv" class="payment__label label_cvv">CVV:</label>
                        <input id="cvv" class="cvv  payment__input" type="tel" inputmode="numeric" pattern="[0-9\s]{3}" autocomplete="cc-number" maxlength="3" required placeholder="Code">
                    </div>
                    <div class="payment__complete-container">
                        <button class="payment__complete" disabled>Complete the payment
                        </button>
                    </div>
                    <div class="canvas__container hidden">
                        <canvas class="canv canvas"></canvas>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

        this.container.append(background, buyingTicketContainer);

        const calendar = <HTMLElement>this.container.querySelector('.selection__calendar');
        const containerForDrawnTickets = <HTMLDivElement>this.container.querySelector('.selection__tickets-container');

        const selection = <HTMLElement>this.container.querySelector('.selection');
        const currentDayOptionsTickets = <HTMLCollectionOf<HTMLElement>>(
            this.container.getElementsByClassName(TicketPage.date)
        );

        //___________???????????????????? input-??????????????????

        createInputCalendar(calendar);

        const inputDate = <HTMLInputElement>this.container.querySelector('.selection__tickets-date');

        inputDate.addEventListener('input', () => {
            TicketPage.date = inputDate.value;

            if (selection.getElementsByClassName(`${TicketPage.date}`)[0]) {

                for (const child of selection.children) {
                    child.classList.add('hidden');
                }
                selection.getElementsByClassName(`${TicketPage.date}`)[0].classList.remove('hidden');
                translateToAnotherLang(langArrBuyTicket, this.container, select);

            } else {

                for (const child of selection.children) {
                    child.classList.add('hidden');
                }

                const otherDayOptionsTickets = document.createElement('div');
                otherDayOptionsTickets.classList.add(inputDate.value);
                selection.append(otherDayOptionsTickets);

                createOptionByuingTicket(
                    onlineTicketsData,
                    otherDayOptionsTickets,
                    makingOrderButt,
                    TicketPage.date,
                    containerForDrawnTickets
                );
                translateToAnotherLang(langArrBuyTicket, otherDayOptionsTickets, select);
            }
        });

        const makingOrderButt = <HTMLButtonElement>this.container.querySelector('.registration__button');
        const selectionButt = <HTMLButtonElement>this.container.querySelector('.selection__button');
        const paymentButt = <HTMLButtonElement>this.container.querySelector('.payment__button');

        const selectionContainer = <HTMLDivElement>this.container.querySelector('.tickets__selection');
        const registrationContainer = <HTMLDivElement>this.container.querySelector('.tickets__registration');
        const paymentContainer = <HTMLDivElement>this.container.querySelector('.ticket__payment');
        const progress = <HTMLDivElement>this.container.querySelector('.progress');
        const registrInputs = <HTMLCollectionOf<HTMLInputElement>>(
            this.container.getElementsByClassName('registration__input')
        );
        const paymentInputs = <HTMLCollectionOf<HTMLInputElement>>this.container.getElementsByClassName('payment__input');
        const completePaymentButt = <HTMLButtonElement>this.container.querySelector('.payment__complete');

        //_____________???????? ?????? inputs ???? ???????????? ???????????????????????? ?????????????????? ??????????????????
        for (const elem of registrInputs) {
            elem.addEventListener('input', () => {
                if (
                    !registrInputs[0].validity.patternMismatch &&
                    !registrInputs[0].validity.tooShort &&
                    !registrInputs[0].validity.valueMissing &&
                    !registrInputs[1].validity.patternMismatch &&
                    !registrInputs[1].validity.tooShort &&
                    !registrInputs[1].validity.valueMissing &&
                    !registrInputs[2].validity.patternMismatch &&
                    !registrInputs[2].validity.valueMissing &&
                    !registrInputs[2].validity.typeMismatch &&
                    !registrInputs[3].validity.typeMismatch &&
                    !registrInputs[3].validity.valueMissing
                ) {
                    paymentButt.disabled = false;
                } else {
                    paymentButt.disabled = true;
                }
            });
        }

        //__________________???????????????????? ???????????????????? ?? ?????????????? ?????????????? ???????? ?????????? ????????????????, ?????????????? ?????????? ???????????? ????????????

        createOptionByuingTicket(
            onlineTicketsData,
            currentDayOptionsTickets[0],
            makingOrderButt,
            TicketPage.date,
            containerForDrawnTickets
        );

        //____________________???????????????????????? ???? ???????????? ????????
        translateToAnotherLang(langArr, this.container, select);
        translateToAnotherLang(langArrHeaderFooter, document, select);
        translateToAnotherLang(langArrBuyTicket, currentDayOptionsTickets[0], select);
        //________________________________________________


        selectionButt.addEventListener('click', () => {
            progress.style.width = 'calc(100% / 3)';
            progress.style.transition = '1000ms';
            progress.style.transitionTimingFunction = 'linear';

            selectionButt.classList.add('tickets__buttons_filed');
            makingOrderButt.classList.remove('tickets__buttons_filed');
            paymentButt.classList.remove('tickets__buttons_filed');

            selectionContainer.classList.remove('hidden');
            registrationContainer.classList.add('hidden');
            paymentContainer.classList.add('hidden');
        });

        makingOrderButt.addEventListener('click', () => {
            progress.style.width = 'calc(200% / 3)';
            progress.style.transition = '1000ms';
            progress.style.transitionTimingFunction = 'linear';

            selectionButt.classList.remove('tickets__buttons_filed');
            makingOrderButt.classList.add('tickets__buttons_filed');
            paymentButt.classList.remove('tickets__buttons_filed');

            selectionContainer.classList.add('hidden');
            registrationContainer.classList.remove('hidden');
            paymentContainer.classList.add('hidden');

            const userNameInput = <HTMLInputElement>this.container.querySelector('.reg__input-name');
            const userSurnameInput = <HTMLInputElement>this.container.querySelector('.reg__input-surname');
            const userEmailInput = <HTMLInputElement>this.container.querySelector('.reg__input-email');
            const userPhoneInput = <HTMLInputElement>this.container.querySelector('.reg__input-phone');

            if (localStorage.getItem("user") !== null) {
                const userAsString = localStorage.getItem("user");
                const nameUserValue: string = userAsString !== null ? JSON.parse(userAsString).name : "The user is not logged in";
                const surnameUserValue: string = userAsString !== null ? JSON.parse(userAsString).surname : "The user is not logged in";
                const emailUserValue: string = userAsString !== null ? JSON.parse(userAsString).email : null;
                const phoneUserValue: string = userAsString !== null ? JSON.parse(userAsString).phone : null;

                userNameInput.value = nameUserValue;
                userSurnameInput.value = surnameUserValue;
                userEmailInput.value = emailUserValue;
                userPhoneInput.value = phoneUserValue;

                if (registrInputs[0].value.length !== 0) {
                    paymentButt.disabled = false
                }
            }
        });

        paymentButt.addEventListener('click', () => {
            progress.style.width = 'calc(300% / 3)';
            progress.style.transition = '1000ms';
            progress.style.transitionTimingFunction = 'linear';

            selectionButt.classList.remove('tickets__buttons_filed');
            makingOrderButt.classList.remove('tickets__buttons_filed');
            paymentButt.classList.add('tickets__buttons_filed');

            selectionContainer.classList.add('hidden');
            registrationContainer.classList.add('hidden');
            paymentContainer.classList.remove('hidden');
        });

        const cardImgContainer = <HTMLDivElement>this.container.querySelector('.payment__container-card-img');
        addCardLogo(cardImgContainer, CardLogo);

        //_______________________________________________________card number

        const cardNumberInp = <HTMLInputElement>this.container.querySelector('.ccn');

        cardNumberInp.addEventListener(
            'input',
            () => (cardNumberInp.value = formatNumberWithSpace(cardNumberInp.value.replaceAll(' ', '')))
        );

        const formatNumberWithSpace = (number: string) =>
            number.split('').reduce((seed, next, index) => {
                if (number[0] === '3') {
                    addCardLogo(cardImgContainer, AmericanExpr);
                } else if (number[0] === '4') {
                    addCardLogo(cardImgContainer, Visa);
                } else if (number[0] === '5') {
                    addCardLogo(cardImgContainer, Mastercard);
                } else if (number[0] === '6') {
                    addCardLogo(cardImgContainer, UnionPay);
                }
                if (index !== 0 && !(index % 4)) seed += ' ';
                return seed + next;
            }, '');

        //_______________________________________________________card valid

        const inputValid = <HTMLInputElement>this.container.querySelector('.valid');

        inputValid.addEventListener(
            'input',
            () => (inputValid.value = formatNumberWithSlash(inputValid.value.replaceAll('/', '')))
        );

        const formatNumberWithSlash = (number: string) =>
            number.split('').reduce((seed, next, index) => {
                if (index !== 0 && !(index % 2)) seed += '/';
                return seed + next;
            }, '');

        for (const elem of paymentInputs) {
            elem.addEventListener('input', () => {
                if (
                    !paymentInputs[0].validity.patternMismatch &&
                    !paymentInputs[0].validity.tooShort &&
                    !paymentInputs[0].validity.valueMissing &&
                    !paymentInputs[1].validity.patternMismatch &&
                    !paymentInputs[1].validity.tooShort &&
                    !paymentInputs[1].validity.valueMissing &&
                    !paymentInputs[2].validity.patternMismatch &&
                    !paymentInputs[2].validity.valueMissing &&
                    !paymentInputs[2].validity.tooShort
                ) {
                    completePaymentButt.disabled = false;
                } else {
                    completePaymentButt.disabled = true;
                }
            });
        }

        //_____________________________________________________________canvas
        const canvasContainer = <HTMLDivElement>this.container.querySelector('.canvas__container');
        const canvas = <HTMLCanvasElement>this.container.querySelector('.canv');
        messageAfterTcketBuying(canvas);
        //__________________________________________________________________canvas activation

        completePaymentButt.addEventListener('click', async () => {
            if (localStorage.getItem("user") !== null) {
                for (const ticket of App.orders) {
                    const response = await addTicketToAccount(ticket)
                }
            }
            canvasContainer.classList.remove('hidden');
            setTimeout(reload, 2000);
        });

        function reload() {
            canvasContainer.classList.add('hidden');
            select.value === "ru" ? goToAnotherPage(PageIds.PricesPageRu) : goToAnotherPage(PageIds.PricesPage);
        }

        return this.container;
    }
}

export default TicketPage;
