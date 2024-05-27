/* document.addEventListener('DOMContentLoaded', function() {
    // Setup for first button and calendar
    var calendarButton4 = document.getElementById('calenda_bottom4');
    var calendarDiv4 = document.getElementById('calendarDiv4');
  
    calendarButton4.addEventListener('click', function() {
        calendarDiv4.style.display = calendarDiv4.style.display === 'none' || calendarDiv4.style.display === '' ? 'block' : 'none';
    });
  
  });
  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }
  function CalendarControl4() {
    const calendar = new Date();
    const calendarControl4 = {
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
        return calendarControl4.firstDay().getDay() + 1;
      },
      lastDayNumber: function () {
        return calendarControl4.lastDay().getDay() + 1;
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
        calendarControl4.attachEventsOnNextPrev();
      },
      navigateToNextMonth: function () {
        calendar.setMonth(calendar.getMonth() + 1);
        calendarControl4.attachEventsOnNextPrev();
      },
      navigateToCurrentMonth: function () {
        let currentMonth = calendarControl4.localDate.getMonth();
        let currentYear = calendarControl4.localDate.getFullYear();
        calendar.setMonth(currentMonth);
        calendar.setYear(currentYear);
        calendarControl4.attachEventsOnNextPrev();
      },
      displayYear: function () {
        let yearLabel = document.querySelector(".calendar4 .calendar-year-label4");
        yearLabel.innerHTML = calendar.getFullYear();
      },
      displayMonth: function () {
        let monthLabel = document.querySelector(
          ".calendar4 .calendar-month-label4"
        );
        monthLabel.innerHTML = calendarControl4.calMonthName[calendar.getMonth()];
      },
      selectDate: function (e) {
        console.log(
          `${e.target.textContent} ${
            calendarControl4.calMonthName[calendar.getMonth()]
          } ${calendar.getFullYear()}`
        );
      },
      plotSelectors: function () {
        document.querySelector(
          ".calendar4"
        ).innerHTML += `<div class="calendar-inner4"><div class="calendar-controls4">
          <div class="calendar-prev4"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></a></div>
          <div class="calendar-year-month4">
          <div class="calendar-month-label4"></div>
          <div>-</div>
          <div class="calendar-year-label4"></div>
          </div>
          <div class="calendar-next4"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></a></div>
          </div>
          <div class="calendar-today-date4"> 
           
          </div>
          <div class="calendar-body4"></div></div>`;
      },
      plotSelectors1: function () {
        document.querySelector(
          ".txtDat4"
        ).innerHTML += `
        ${calendarControl4.localDate.getDate()}-
        ${calendarControl4.calMonthName[calendarControl4.localDate.getMonth()]}- 
        ${calendarControl4.localDate.getFullYear()}   
        `;
      },
      plotDayNames: function () {
        for (let i = 0; i < calendarControl4.calWeekDays.length; i++) {
          document.querySelector(
            ".calendar4 .calendar-body4"
          ).innerHTML += `<div>${calendarControl4.calWeekDays[i]}</div>`;
        }
      },
      plotDates: function () {
        document.querySelector(".calendar4 .calendar-body4").innerHTML = "";
        calendarControl4.plotDayNames();
        calendarControl4.displayMonth();
        calendarControl4.displayYear();
        let count = 1;
        let prevDateCount = 0;
  
        calendarControl4.prevMonthLastDate = calendarControl4.getPreviousMonthLastDate();
        let prevMonthDatesArray = [];
        let calendarDays = calendarControl4.daysInMonth(
          calendar.getMonth() + 1,
          calendar.getFullYear()
        );
        // dates of current month
        for (let i = 1; i < calendarDays; i++) {
          if (i < calendarControl4.firstDayNumber()) {
            prevDateCount += 1;
            document.querySelector(
              ".calendar4 .calendar-body4"
            ).innerHTML += `<div class="prev-dates4"></div>`;
            prevMonthDatesArray.push(calendarControl4.prevMonthLastDate--);
          } else {
            document.querySelector(
              ".calendar4 .calendar-body4"
            ).innerHTML += `<div class="number-item4" data-num=${count}><a class="dateNumber4" href="#">${count++}</a></div>`;
          }
        }
        //remaining dates after month dates
        for (let j = 0; j < prevDateCount + 1; j++) {
          document.querySelector(
            ".calendar4 .calendar-body4"
          ).innerHTML += `<div class="number-item4" data-num=${count}><a class="dateNumber4" href="#">${count++}</a></div>`;
        }
        calendarControl4.highlightToday();
        calendarControl4.plotPrevMonthDates(prevMonthDatesArray);
        calendarControl4.plotNextMonthDates();
      },
      attachEvents: function () {
        let prevBtn = document.querySelector(".calendar4 .calendar-prev4 a");
        let nextBtn = document.querySelector(".calendar4 .calendar-next4 a");
        let todayDate = document.querySelector(".calendar4 .calendar-today-date4");
        let dateNumber = document.querySelectorAll(".calendar4 .dateNumber4");
        prevBtn.addEventListener(
          "click",
          calendarControl4.navigateToPreviousMonth
        );
        nextBtn.addEventListener("click", calendarControl4.navigateToNextMonth);
        todayDate.addEventListener(
          "click",
          calendarControl4.navigateToCurrentMonth
        );
        for (var i = 0; i < dateNumber.length; i++) {
            dateNumber[i].addEventListener(
              "click",
              calendarControl4.selectDate,
              false
            );
        }
      },
      highlightToday: function () {
        let currentMonth = calendarControl4.localDate.getMonth() + 1;
        let changedMonth = calendar.getMonth() + 1;
        let currentYear = calendarControl4.localDate.getFullYear();
        let changedYear = calendar.getFullYear();
        if (
          currentYear === changedYear &&
          currentMonth === changedMonth &&
          document.querySelectorAll(".number-item4")
        ) {
          document
            .querySelectorAll(".number-item4")
            [calendar.getDate() - 1].classList.add("calendar-today4");
        }
      },
      plotPrevMonthDates: function(dates){
        dates.reverse();
        for(let i=0;i<dates.length;i++) {
            if(document.querySelectorAll(".prev-dates4")) {
                document.querySelectorAll(".prev-dates4")[i].textContent = dates[i];
            }
        }
      },
      plotNextMonthDates: function(){
       let childElemCount = document.querySelector('.calendar-body4').childElementCount;
       //7 lines
       if(childElemCount > 42 ) {
           let diff = 49 - childElemCount;
           calendarControl4.loopThroughNextDays(diff);
       }

       //6 lines
       if(childElemCount > 35 && childElemCount <= 42 ) {
        let diff = 42 - childElemCount;
        calendarControl4.loopThroughNextDays(42 - childElemCount);
       }

      },
      loopThroughNextDays: function(count) {
        if(count > 0) {
            for(let i=1;i<=count;i++) {
                document.querySelector('.calendar-body4').innerHTML += `<div class="next-dates4">${i}</div>`;
            }
        }
      },
      attachEventsOnNextPrev: function () {
        calendarControl4.plotDates();
        calendarControl4.attachEvents();
      },
      selectDate: function (e) {
        let selectedDate = e.target.textContent;
        let formattedDate = `${selectedDate}-${calendarControl4.calMonthName[calendar.getMonth()]}-${calendar.getFullYear()}`;
        document.querySelector(".txtDat4").textContent = formattedDate;
    },
      init: function () {
        calendarControl4.plotSelectors();
        calendarControl4.plotDates();
        calendarControl4.attachEvents();
        let todayDateObj = new Date();
          let todayDay = String(todayDateObj.getDate()).padStart(2, '0');
          let todayMonth = String(todayDateObj.getMonth() + 1).padStart(2, '0'); // January is 0!
          let todayYear = todayDateObj.getFullYear();
          let todayDate = `${todayYear}-${todayMonth}-${todayDay}`;
          document.querySelector(".txtDat4").textContent = todayDate;
          console.log("remaining for Date:", todayDate);
          fetchDatapopularProduct(null, todayDate)
      },
       
    };
    calendarControl4.init();
  }
  const calendarControl4 = new CalendarControl4(); */
/* 
  document.querySelector('.calendar4').addEventListener('click', function(event) {
    if (event.target.classList.contains('dateNumber4')) {
        let formattedDate = document.querySelector(".txtDat4").textContent; // ดึงข้อมูลวันที่ที่ได้รูปแบบแล้ว
        let dateParts = formattedDate.split('-'); // แยกส่วนวันที่ เช่น ["27", "Mar", "2023"]

        // แปลงชื่อเดือนเป็นหมายเลข
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthIndex = monthNames.indexOf(dateParts[1]) + 1; // หาดัชนีของเดือนและเพิ่ม 1 เพื่อให้ได้ตัวเลขเดือนที่ถูกต้อง

        // รูปแบบวันที่ให้เป็น YYYY-MM-DD
        const selectedDate = `${dateParts[2]}-${('0' + monthIndex).slice(-2)}-${('0' + dateParts[0]).slice(-2)}`;
        const todayDate = `${dateParts[2]}-${('0' + monthIndex).slice(-2)}-${('0' + dateParts[0]).slice(-2)}`;

        fetchDatapopularProduct(selectedDate, todayDate);
        console.log("Selected Date:", selectedDate);
        console.log("Today Date:",  todayDate);
    }
  });   */

  function fetchDatapopularProduct(todayDate) {
    console.log("Fetching data and plotting polar graph for:", todayDate);
    const productPopularforDay = `http://localhost:3443/productPopular5?date=${todayDate}`;
    console.log("productPopular5 Endpoint:", productPopularforDay);

    fetch(productPopularforDay)
        .then(response => response.json())
        .then(data => {
            console.log("productPopular5:", data);
            circlegarph(data);
        })
        .catch(error => {
            console.error('Failed to fetch data:', error);
        });
}

function circlegarph(data) {
  // Check if the data array is empty
  let labels, dataPoints, colors;
  if (data.length === 0) {
      console.warn("No data available for the selected day.");
      // Set default values for an empty graph
      labels = ["No data available"];
      dataPoints = [0];
      colors = ['rgba(200, 200, 200, 0.6)'];
  } else {
      // Set data when available
      labels = data.map(item => item.productName);
      dataPoints = data.map(item => item.totalQuantitySold);
      colors = generateColors(data.length);
  }

  // Get the chart context from the HTML element
  const ctx = document.getElementById('pieChart').getContext('2d');
  // Create a new polar chart
  window.myChart = new Chart(ctx, {
      type: 'polarArea',
      data: {
          labels: labels,
          datasets: [{
              label: 'Total Quantity Sold',
              data: dataPoints,
              backgroundColor: colors,
              borderColor: colors.map(color => color.replace('0.6', '1')),
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
              legend: {
                  display: true,
                  position: 'top'
              }
          },
          scales: {
              r: {
                  beginAtZero: true
              }
          }
      }
  });
}

function generateColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
      // Generate random RGBA colors
      const randomColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
      colors.push(randomColor);
  }
  return colors;
}

