/* document.addEventListener('DOMContentLoaded', function() {
  // Setup for first button and calendar
  var calendarButton1 = document.getElementById('calenda_bottom');
  var calendarDiv1 = document.getElementById('calendarDiv2');

  calendarButton1.addEventListener('click', function() {
      calendarDiv1.style.display = calendarDiv1.style.display === 'none' || calendarDiv1.style.display === '' ? 'block' : 'none';
  });

});

function getCurrentDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
}

function CalendarControl2() {
    const calendar = new Date();
    const calendarControl = {
      localDate: new Date(),
      prevMonthLastDate: null,
      calWeekDays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      calMonthName: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      daysInMonth: function (month, year) {
        return new Date(year, month, 0).getDate();
      },
      firstDay: function () {
        return new Date(calendar.getFullYear(), calendar.getMonth(), 1);
      },
      lastDay: function () {
        return new Date(calendar.getFullYear(), calendar.getMonth() + 1, 0);
      },
      firstDayNumber: function () {
        return calendarControl.firstDay().getDay() + 1;
      },
      lastDayNumber: function () {
        return calendarControl.lastDay().getDay() + 1;
      },
      getPreviousMonthLastDate: function () {
        let lastDate = new Date(
          calendar.getFullYear(),
          calendar.getMonth(),
          0
        ).getDate();
        return lastDate;
      },
      navigateToPreviousMonth: function () {
        calendar.setMonth(calendar.getMonth() - 1);
        calendarControl.attachEventsOnNextPrev();
      },
      navigateToNextMonth: function () {
        calendar.setMonth(calendar.getMonth() + 1);
        calendarControl.attachEventsOnNextPrev();
      },
      navigateToCurrentMonth: function () {
        let currentMonth = calendarControl.localDate.getMonth();
        let currentYear = calendarControl.localDate.getFullYear();
        calendar.setMonth(currentMonth);
        calendar.setYear(currentYear);
        calendarControl.attachEventsOnNextPrev();
      },
      displayYear: function () {
        let yearLabel = document.querySelector(".calendar2 .calendar-year-label2");
        yearLabel.innerHTML = calendar.getFullYear();
      },
      displayMonth: function () {
        let monthLabel = document.querySelector(
          ".calendar2 .calendar-month-label2"
        );
        monthLabel.innerHTML = calendarControl.calMonthName[calendar.getMonth()];
      },
      selectDate: function (e) {
        console.log(
          `${e.target.textContent} ${
            calendarControl.calMonthName[calendar.getMonth()]
          } ${calendar.getFullYear()}`
        );
      },
      plotSelectors: function () {
        document.querySelector(
          ".calendar2"
        ).innerHTML += `<div class="calendar-inner2"><div class="calendar-controls2">
          <div class="calendar-prev2"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></a></div>
          <div class="calendar-year-month2">
          <div class="calendar-month-label2"></div>
          <div>-</div>
          <div class="calendar-year-label2"></div>
          </div>
          <div class="calendar-next2"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></a></div>
          </div>
          <div class="calendar-today-date2"> 
           
          </div>
          <div class="calendar-body2"></div></div>`;
      },
      plotSelectors1: function () {
        document.querySelector(
          ".txtDat2"
        ).innerHTML += `
        ${calendarControl.localDate.getDate()}-
        ${calendarControl.calMonthName[calendarControl.localDate.getMonth()]}- 
        ${calendarControl.localDate.getFullYear()}   
        `;
      },
      plotDayNames: function () {
        for (let i = 0; i < calendarControl.calWeekDays.length; i++) {
          document.querySelector(
            ".calendar2 .calendar-body2"
          ).innerHTML += `<div>${calendarControl.calWeekDays[i]}</div>`;
        }
      },
      plotDates: function () {
        document.querySelector(".calendar2 .calendar-body2").innerHTML = "";
        calendarControl.plotDayNames();
        calendarControl.displayMonth();
        calendarControl.displayYear();
        let count = 1;
        let prevDateCount = 0;
  
        calendarControl.prevMonthLastDate = calendarControl.getPreviousMonthLastDate();
        let prevMonthDatesArray = [];
        let calendarDays = calendarControl.daysInMonth(
          calendar.getMonth() + 1,
          calendar.getFullYear()
        );
        // dates of current month
        for (let i = 1; i < calendarDays; i++) {
          if (i < calendarControl.firstDayNumber()) {
            prevDateCount += 1;
            document.querySelector(
              ".calendar2 .calendar-body2"
            ).innerHTML += `<div class="prev-dates2"></div>`;
            prevMonthDatesArray.push(calendarControl.prevMonthLastDate--);
          } else {
            document.querySelector(
              ".calendar2 .calendar-body2"
            ).innerHTML += `<div class="number-item2" data-num=${count}><a class="dateNumber2" href="#">${count++}</a></div>`;
          }
        }
        //remaining dates after month dates
        for (let j = 0; j < prevDateCount + 1; j++) {
          document.querySelector(
            ".calendar2 .calendar-body2"
          ).innerHTML += `<div class="number-item2" data-num=${count}><a class="dateNumber2" href="#">${count++}</a></div>`;
        }
        calendarControl.highlightToday();
        calendarControl.plotPrevMonthDates(prevMonthDatesArray);
        calendarControl.plotNextMonthDates();
      },
      attachEvents: function () {
        let prevBtn = document.querySelector(".calendar2 .calendar-prev2 a");
        let nextBtn = document.querySelector(".calendar2 .calendar-next2 a");
        let todayDate = document.querySelector(".calendar2 .calendar-today-date2");
        let dateNumber = document.querySelectorAll(".calendar2 .dateNumber2");
        prevBtn.addEventListener(
          "click",
          calendarControl.navigateToPreviousMonth
        );
        nextBtn.addEventListener("click", calendarControl.navigateToNextMonth);
        todayDate.addEventListener(
          "click",
          calendarControl.navigateToCurrentMonth
        );
        for (var i = 0; i < dateNumber.length; i++) {
            dateNumber[i].addEventListener(
              "click",
              calendarControl.selectDate,
              false
            );
        }
      },
      highlightToday: function () {
        let currentMonth = calendarControl.localDate.getMonth() + 1;
        let changedMonth = calendar.getMonth() + 1;
        let currentYear = calendarControl.localDate.getFullYear();
        let changedYear = calendar.getFullYear();
        if (
          currentYear === changedYear &&
          currentMonth === changedMonth &&
          document.querySelectorAll(".number-item2")
        ) {
          document
            .querySelectorAll(".number-item2")
            [calendar.getDate() - 1].classList.add("calendar-today2");
        }
      },
      plotPrevMonthDates: function(dates){
        dates.reverse();
        for(let i=0;i<dates.length;i++) {
            if(document.querySelectorAll(".prev-dates2")) {
                document.querySelectorAll(".prev-dates2")[i].textContent = dates[i];
            }
        }
      },
      plotNextMonthDates: function(){
       let childElemCount = document.querySelector('.calendar-body2').childElementCount;
       //7 lines
       if(childElemCount > 42 ) {
           let diff = 49 - childElemCount;
           calendarControl.loopThroughNextDays(diff);
       }

       //6 lines
       if(childElemCount > 35 && childElemCount <= 42 ) {
        let diff = 42 - childElemCount;
        calendarControl.loopThroughNextDays(42 - childElemCount);
       }

      },
      loopThroughNextDays: function(count) {
        if(count > 0) {
            for(let i=1;i<=count;i++) {
                document.querySelector('.calendar-body2').innerHTML += `<div class="next-dates2">${i}</div>`;
            }
        }
      },
      attachEventsOnNextPrev: function () {
        calendarControl.plotDates();
        calendarControl.attachEvents();
      },
      selectDate: function (e) {
        let selectedDate = e.target.textContent;
        let formattedDate = `${selectedDate}-${calendarControl.calMonthName[calendar.getMonth()]}-${calendar.getFullYear()}`;
        document.querySelector(".txtDat2").textContent = formattedDate;
    },
      init: function () {
        calendarControl.plotSelectors();
        calendarControl.plotDates();
        calendarControl.attachEvents();
        let todayDateObj = new Date();
        let todayDay = String(todayDateObj.getDate()).padStart(2, '0');
        let todayMonth = String(todayDateObj.getMonth() + 1).padStart(2, '0'); // January is 0!
        let todayYear = todayDateObj.getFullYear();
        let todayDate = `${todayYear}-${todayMonth}-${todayDay}`;
        document.querySelector(".txtDat2").textContent = todayDate;
        console.log("ToDay Date employee:", todayDate);
        fetchDataRankSalesEmployee(null, todayDate)
      },
       
    };
    calendarControl.init();
  }
  const calendarControl2 = new CalendarControl2();

  //ฟังก์ชั่นเเปลงวันที่
  document.querySelector('.calendar2').addEventListener('click', function(event) {
    if (event.target.classList.contains('dateNumber2')) {
        let formattedDate = document.querySelector(".txtDat2").textContent; // ดึงข้อมูลวันที่ที่ได้รูปแบบแล้ว
        let dateParts = formattedDate.split('-'); // แยกส่วนวันที่ เช่น ["27", "Mar", "2023"]

        // แปลงชื่อเดือนเป็นหมายเลข
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthIndex = monthNames.indexOf(dateParts[1]) + 1; // หาดัชนีของเดือนและเพิ่ม 1 เพื่อให้ได้ตัวเลขเดือนที่ถูกต้อง

        // รูปแบบวันที่ให้เป็น YYYY-MM-DD
        const selectedDate = `${dateParts[2]}-${('0' + monthIndex).slice(-2)}-${('0' + dateParts[0]).slice(-2)}`;
        const todayDate = `${dateParts[2]}-${('0' + monthIndex).slice(-2)}-${('0' + dateParts[0]).slice(-2)}`;

        fetchDataRankSalesEmployee(selectedDate, todayDate);
        console.log("Selected Date:", selectedDate);
        console.log("Today Date:",  todayDate);
    }
}); */


function fetchDataRankSalesEmployee(todayDate) {
  console.log("Fetching data and Rank for:", todayDate);
  const RankSalesEmployeeUrl = `http://localhost:3443/employeeSales?date=${todayDate}`;
  console.log("RankSalesEmployeeUrl:", RankSalesEmployeeUrl);

  fetch(RankSalesEmployeeUrl)
      .then(response => response.json())
      .then(data => {
          console.log("RankSalesEmployeeData:", data);
          updateUI(data);
      })
      .catch(error => {
          console.error('Failed to fetch data:', error);
          updateUI([]); // Call updateUI with an empty array in case of error
      });
}

function updateUI(data) {
  const listContainer = document.getElementById('list-container');  // Ensure this ID matches your HTML
  // Clear all children to start fresh each time this function runs
  listContainer.innerHTML = '';

  if (data && data.length) {
      // Sort data by quantity from highest to lowest
      data.sort((a, b) => b.quantity - a.quantity);

      data.forEach((item) => {
          const listItem = document.createElement('li');
          listItem.className = 'list-group-item';
          listItem.innerHTML = `
              <div class="row">
                  <div class="col">
                      <span class="name">${item.name}</span>
                  </div>
                  <div class="col d-flex justify-content-center">
                      <span class="quantity">${item.quantity}</span>
                  </div>
                  <div class="col d-flex justify-content-end" style="color: #12B495;">
                      <span class="totalSales">฿${parseFloat(item.totalSales).toFixed(2)}</span>
                  </div>
              </div>
          `;
          listContainer.appendChild(listItem);
      });
  } else {
      // Display an empty row when no data is available
      const emptyItem = document.createElement('li');
      emptyItem.className = 'list-group-item';
      emptyItem.innerHTML = `
          <div class="row">
              <div class="col">
                  <span class="name"></span>
              </div>
              <div class="col d-flex justify-content-center">
                  <span class="quantity"></span>
              </div>
              <div class="col d-flex justify-content-end" style="color: #12B495;">
                  <span class="totalSales"></span>
              </div>
          </div>
      `;
      listContainer.appendChild(emptyItem);
  }
}


