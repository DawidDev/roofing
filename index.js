class MagentaHandle {
  constructor() {
    this.createCalendar(".calendar_form", "2");
    this.createCalendar(".calendar", "1");
    this.handleAddQuests()
  }

  createCalendar(calendarBox, indexCalendar, actualMonthOnCalendarPage) {
    let calendar = document.querySelector(calendarBox);

    const day_names = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wenesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const month_names = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const isLeapYear = (year) => {
      return (
        (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
        (year % 100 === 0 && year % 400 === 0)
      );
    };

    const getFebDays = (year) => {
      return isLeapYear(year) ? 29 : 28;
    };

    const generateCalendar = (month, year) => {
      let calendar_days = calendar.querySelector(".calendar-days");
      let calendar_header_year = calendar.querySelector("#year");

      let days_of_month = [
        31,
        getFebDays(year),
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
      ];

      calendar_days.innerHTML = "";

      let currDate = new Date();
      if (!month) month = currDate.getMonth();
      if (!year) year = currDate.getFullYear();

      let curr_month = `${month_names[month]}`;
      month_picker.innerHTML = curr_month;
      calendar_header_year.innerHTML = year;

      // Pobieranie pierwszego dnia miesiąca

      let first_day = new Date(year, month, 1);

      for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {
        let day = document.createElement("div");
        day.setAttribute("id", i);
        if (i >= first_day.getDay()) {
          day.classList.add("calendar-day-hover");
          if (indexCalendar === "1") {
            /*Atrubute for modal*/
            day.setAttribute("data-bs-toggle", "modal");
            day.setAttribute("href", "#CalendarModal");
            /* ***** */
          }
          let numberDayOfMonh = i - first_day.getDay() + 1;
          day.setAttribute("data-number", numberDayOfMonh); // For style on click in calendar on main page
          day.setAttribute("value", numberDayOfMonh);

          day.innerHTML = i - first_day.getDay() + 1;
          day.innerHTML += `<span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>`;
          if (
            i - first_day.getDay() + 1 === currDate.getDate() &&
            year === currDate.getFullYear() &&
            month === currDate.getMonth()
          ) {
            day.classList.add("curr-date");
          }
        }
        calendar_days.appendChild(day);
      }
    };

    let month_list = calendar.querySelector(".month-list");

    month_names.forEach((e, index) => {
      let month = document.createElement("div");
      month.innerHTML = `<div data-month="${index}">${e}</div>`;
      month.querySelector("div").onclick = () => {
        month_list.classList.remove("show");
        curr_month.value = index;
        generateCalendar(index, curr_year.value);
      };
      month_list.appendChild(month);
    });

    let month_picker = calendar.querySelector("#month-picker");

    month_picker.onclick = () => {
      month_list.classList.add("show");
    };

    let currDate = new Date();

    let curr_month = { value: currDate.getMonth() };
    let curr_year = { value: currDate.getFullYear() };

    // Support for changing the month from the calendar on the home page.
    curr_month = actualMonthOnCalendarPage
      ? { value: actualMonthOnCalendarPage }
      : { value: currDate.getMonth() };

    generateCalendar(curr_month.value, curr_year.value);

    const prevMonth = `#prev-year-` + indexCalendar;
    const nextMonth = `#next-year-` + indexCalendar;
    document.querySelector(prevMonth).onclick = () => {
      if (curr_month.value > 0) {
        --curr_month.value;
      } else curr_month.value = 11;
      generateCalendar(curr_month.value, curr_year.value);

      /* Chose month in calendar in form */
      this.createCalendar(".calendar_form", "2", curr_month.value);
      this.createCalendar(".calendar", "1", curr_month.value);
    };

    document.querySelector(nextMonth).onclick = () => {
      if (curr_month.value < 11) {
        ++curr_month.value;
      } else curr_month.value = 0;
      generateCalendar(curr_month.value, curr_year.value);

      /* Chose month in calendar in form */
      this.createCalendar(".calendar_form", "2", curr_month.value);
      this.createCalendar(".calendar", "1", curr_month.value);
    };

    // Box in HTML DOM where is placed choosed date from form
    const summary_date = document.querySelector("#summary_date");

    let today = currDate.getDate();
    const returnChoosedDate = (day, month, year) => {
      const boxForChoosedDate = document.querySelector("#choosedDate");
      const displayMonth = month + 1;
      const dayToDisplay = day > 9 ? day : `0${day}`;
      const monthToDisplay =
        displayMonth > 9 ? displayMonth : `0${displayMonth}`;
      const yearToDisplay = year > 9 ? year : `0${year}`;

      boxForChoosedDate.textContent = `Choosed date: ${dayToDisplay}.${monthToDisplay}.${yearToDisplay}`;

      // Summary Data insert
      const newDate = new Date(year, month, day);
      const numberDayInWeek = newDate.getDay();
      const nameChoosedDay = day_names[numberDayInWeek];
      const nameChoosedMonth = month_names[month];

      // Set date in end of form in modal
      summary_date.textContent = `${nameChoosedDay}, ${nameChoosedMonth}, ${curr_year.value}`;

      // Handle hours input button
      this.handleHourInForm(year, month, day);
    };
    //returnChoosedDate(today, curr_month.value, curr_year.value);

    // Listening on click in button on main page to set default date in calendar form
    const startFormHandeBtn = document.querySelector("#contact");
    startFormHandeBtn.addEventListener(
      "click",
      returnChoosedDate(today, curr_month.value, curr_year.value)
    );

    // Handle for set date on click in any day in calendar
    const handlePicker = () => {
      const checkThisDate = (event) => {
        const pickDay = event.target.getAttribute("value");

        // Support for selecting the selected day with color on main page and on form page.
        const choosedDayStyle = document.querySelectorAll("[data-number]");
        choosedDayStyle.forEach((item) => {
          const value = item.getAttribute("data-number");
          item.classList.remove("curr-date");
          item.classList.remove("checked_day_picker");

          if (pickDay == value) {
            item.classList.add("curr-date");
          }
        });

        returnChoosedDate(pickDay, curr_month.value, curr_year.value);
      };

      // Listening for a click event on the selected date (day)
      const pickers = document.querySelectorAll(".calendar-day-hover"); // Listener onClick in calendar on te page. Not i popup
      pickers.forEach((item) => {
        item.addEventListener("click", checkThisDate.bind(this));
        //returnChoosedDate(today, curr_month.value, curr_year.value);
      });
    };
    handlePicker();
  }

  handleHourInForm(year, month, day) {
    const hour_box = document.querySelector(".hour_box");

    // Date from form if is any
    const date_from_form = new Date(year, month, day);
    const formDate = date_from_form.getDate();
    const choosedMonthInForm = date_from_form.getMonth();

    // Today date
    const todayDate = new Date();
    const actualDate = todayDate.getDate();
    const actualMonth = todayDate.getMonth();

    const setHourSummary = (hour, minutes) => {
      const summary_hour_box = document.getElementById("summary_time");
      const timeZoneCaluclateHour = this.calculateLocalTime(hour);
      summary_hour_box.textContent = `${timeZoneCaluclateHour}:${minutes}`;
    };

    const createButtons = (option) => {
      hour_box.innerHTML = ""; // Clean box to refresh new hours

      const tab = [];

      // If the selected date is less than the current time, do not give any options.
      if (option === "nothing") {
        return;
      }

      let hour = option === "allHours" ? 8 : todayDate.getHours() + 1;
      let minutes = 0;

      while (hour < 24) {
        const m = minutes > 9 ? minutes : `0${minutes}`;
        const h = hour > 9 ? hour : `0${hour}`;
        const objectHour = `${h}:${m}`;
        tab.push(objectHour);

        const div = document.createElement("div");
        div.setAttribute("id", "confirmBox");
        div.classList.add('my-2')

        const confirm_button = document.createElement("button");
        confirm_button.setAttribute("id", "btnConfirm");
        confirm_button.textContent = "Confirm";

        /* Bootstrap support atribute for handle modal  */
        confirm_button.setAttribute("data-bs-target", "#CalendarModal2");
        confirm_button.setAttribute("data-bs-toggle", "modal");
        confirm_button.setAttribute("data-bs-dismiss", "modal");


        const hour_input = document.createElement("button");
        hour_input.setAttribute("id", "btnHour");
        hour_input.innerHTML = `<i class="bi bi-check-circle-fill d-none pe-1"></i>${h}:${m}`;
        hour_input.addEventListener("click", setHourSummary.bind(this, h, m));

        /* Bootstrap classes for style */
        hour_input.classList.add("text_pink");
        hour_input.classList.add("p-3");
        hour_input.classList.add("btn");
        hour_input.classList.add("border");

        confirm_button.classList.add("btn");
        confirm_button.classList.add("bg_pink");
        confirm_button.classList.add("py-3");
        confirm_button.classList.add("text-white");

        div.appendChild(hour_input);
        div.appendChild(confirm_button);
        hour_box.appendChild(div);

        if (minutes < 45) {
          minutes = minutes + 15;
        } else if (minutes === 45) {
          minutes = 0;
          hour++;
        }
      }
    };

    if (actualDate < formDate && actualMonth <= choosedMonthInForm) {
      createButtons("allHours");
    } else if (actualDate === formDate && actualMonth === choosedMonthInForm) {
      createButtons("avaibleTodayHours");
    } else if (actualDate > formDate && actualMonth < choosedMonthInForm) {
      createButtons("allHours");
    } else if (actualDate > formDate && actualMonth >= choosedMonthInForm) {
      createButtons("nothing");
    }
  }

  calculateLocalTime(hourFromForm) {
    /*
    The method responsible for calculating the local meeting time for the user. 
    The time in the form is for the company, the time in the summary is the 
    time for the user relative to their local time.
    */

    let hour = hourFromForm;

    const timeZoneMagentaLocation = -5; // SET HERE TOMEZONE MAGENTA COMPANY

    const d = new Date();
    const localOffset = d.getTimezoneOffset() / 60; // user offset timezone

    const offset = timeZoneMagentaLocation + localOffset; //in hours

    if (offset > 0) {
      hour = hour + offset;
    } else if (offset < 0) hour = hour - offset;

    if (hour > 24) {
      hour = hour - 24;
    } else if (hour < 0) {
      hour = hour * -1;
    } else if (hour === 24) {
      hour = 0;
    }

    return hour;
  }

  handleAddQuests() {
    const btnAddQuests = document.getElementById("add_guests");
    const boxGuests = document.getElementById("guestsBox");

    const addGuests = () => {
      const inputName = document.createElement("input");
      inputName.setAttribute("placeholder", "Name");
      
      inputName.classList.add("form-control-lg")
      inputName.classList.add("w-100")
      inputName.classList.add("border")
      inputName.classList.add("rounded-0")
      inputName.classList.add("my-1")
      

      const inputMail = document.createElement("input");
      inputMail.setAttribute("placeholder", "E-mail");
      inputMail.classList.add("form-control-lg")
      inputMail.classList.add("w-100")
      inputMail.classList.add("border")
      inputMail.classList.add("rounded-0")
      inputMail.classList.add("my-1")

      boxGuests.appendChild(inputName);
      boxGuests.appendChild(inputMail);
    };

    btnAddQuests.addEventListener("click", addGuests);
  }
}

const MagentaPage = new MagentaHandle();
