/* document.addEventListener('DOMContentLoaded', function() {
    // Setup for first button and calendar
    var calendarButton3 = document.getElementById('calenda_bottom3');
    var calendarDiv3 = document.getElementById('calendarDiv3');
  
    calendarButton3.addEventListener('click', function() {
        calendarDiv3.style.display = calendarDiv3.style.display === 'none' || calendarDiv3.style.display === '' ? 'block' : 'none';
    });
  
  });
  function getCurrentDate() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    const year = today.getFullYear();
    return `${year}-${month}-${day}`;
  }
  
  
  
  function CalendarControl3() {
      const calendar = new Date();
      const calendarControl3 = {
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
          return calendarControl3.firstDay().getDay() + 1;
        },
        lastDayNumber: function () {
          return calendarControl3.lastDay().getDay() + 1;
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
          calendarControl3.attachEventsOnNextPrev();
        },
        navigateToNextMonth: function () {
          calendar.setMonth(calendar.getMonth() + 1);
          calendarControl3.attachEventsOnNextPrev();
        },
        navigateToCurrentMonth: function () {
          let currentMonth = calendarControl3.localDate.getMonth();
          let currentYear = calendarControl3.localDate.getFullYear();
          calendar.setMonth(currentMonth);
          calendar.setYear(currentYear);
          calendarControl3.attachEventsOnNextPrev();
        },
        displayYear: function () {
          let yearLabel = document.querySelector(".calendar3 .calendar-year-label3");
          yearLabel.innerHTML = calendar.getFullYear();
        },
        displayMonth: function () {
          let monthLabel = document.querySelector(
            ".calendar3 .calendar-month-label3"
          );
          monthLabel.innerHTML = calendarControl3.calMonthName[calendar.getMonth()];
        },
        selectDate: function (e) {
          console.log(
            `${e.target.textContent} ${
              calendarControl3.calMonthName[calendar.getMonth()]
            } ${calendar.getFullYear()}`
          );
        },
        plotSelectors: function () {
          document.querySelector(
            ".calendar3"
          ).innerHTML += `<div class="calendar-inner3"><div class="calendar-controls3">
            <div class="calendar-prev3"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></a></div>
            <div class="calendar-year-month3">
            <div class="calendar-month-label3"></div>
            <div>-</div>
            <div class="calendar-year-label3"></div>
            </div>
            <div class="calendar-next3"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></a></div>
            </div>
            <div class="calendar-today-date3"> 
             
            </div>
            <div class="calendar-body3"></div></div>`;
        },
        plotSelectors1: function () {
          document.querySelector(
            ".txtDat3"
          ).innerHTML += `
          ${calendarControl3.localDate.getDate()}-
          ${calendarControl3.calMonthName[calendarControl3.localDate.getMonth()]}- 
          ${calendarControl3.localDate.getFullYear()}   
          `;
        },
        plotDayNames: function () {
          for (let i = 0; i < calendarControl3.calWeekDays.length; i++) {
            document.querySelector(
              ".calendar3 .calendar-body3"
            ).innerHTML += `<div>${calendarControl3.calWeekDays[i]}</div>`;
          }
        },
        plotDates: function () {
          document.querySelector(".calendar3 .calendar-body3").innerHTML = "";
          calendarControl3.plotDayNames();
          calendarControl3.displayMonth();
          calendarControl3.displayYear();
          let count = 1;
          let prevDateCount = 0;
    
          calendarControl3.prevMonthLastDate = calendarControl3.getPreviousMonthLastDate();
          let prevMonthDatesArray = [];
          let calendarDays = calendarControl3.daysInMonth(
            calendar.getMonth() + 1,
            calendar.getFullYear()
          );
          // dates of current month
          for (let i = 1; i < calendarDays; i++) {
            if (i < calendarControl3.firstDayNumber()) {
              prevDateCount += 1;
              document.querySelector(
                ".calendar3 .calendar-body3"
              ).innerHTML += `<div class="prev-dates3"></div>`;
              prevMonthDatesArray.push(calendarControl3.prevMonthLastDate--);
            } else {
              document.querySelector(
                ".calendar3 .calendar-body3"
              ).innerHTML += `<div class="number-item3" data-num=${count}><a class="dateNumber3" href="#">${count++}</a></div>`;
            }
          }
          //remaining dates after month dates
          for (let j = 0; j < prevDateCount + 1; j++) {
            document.querySelector(
              ".calendar3 .calendar-body3"
            ).innerHTML += `<div class="number-item3" data-num=${count}><a class="dateNumber3" href="#">${count++}</a></div>`;
          }
          calendarControl3.highlightToday();
          calendarControl3.plotPrevMonthDates(prevMonthDatesArray);
          calendarControl3.plotNextMonthDates();
        },
        attachEvents: function () {
          let prevBtn = document.querySelector(".calendar3 .calendar-prev3 a");
          let nextBtn = document.querySelector(".calendar3 .calendar-next3 a");
          let todayDate = document.querySelector(".calendar3 .calendar-today-date3");
          let dateNumber = document.querySelectorAll(".calendar3 .dateNumber3");
          prevBtn.addEventListener(
            "click",
            calendarControl3.navigateToPreviousMonth
          );
          nextBtn.addEventListener("click", calendarControl3.navigateToNextMonth);
          todayDate.addEventListener(
            "click",
            calendarControl3.navigateToCurrentMonth
          );
          for (var i = 0; i < dateNumber.length; i++) {
              dateNumber[i].addEventListener(
                "click",
                calendarControl3.selectDate,
                false
              );
          }
        },
        highlightToday: function () {
          let currentMonth = calendarControl3.localDate.getMonth() + 1;
          let changedMonth = calendar.getMonth() + 1;
          let currentYear = calendarControl3.localDate.getFullYear();
          let changedYear = calendar.getFullYear();
          if (
            currentYear === changedYear &&
            currentMonth === changedMonth &&
            document.querySelectorAll(".number-item3")
          ) {
            document
              .querySelectorAll(".number-item3")
              [calendar.getDate() - 1].classList.add("calendar-today3");
          }
        },
        plotPrevMonthDates: function(dates){
          dates.reverse();
          for(let i=0;i<dates.length;i++) {
              if(document.querySelectorAll(".prev-dates3")) {
                  document.querySelectorAll(".prev-dates3")[i].textContent = dates[i];
              }
          }
        },
        plotNextMonthDates: function(){
         let childElemCount = document.querySelector('.calendar-body3').childElementCount;
         //7 lines
         if(childElemCount > 42 ) {
             let diff = 49 - childElemCount;
             calendarControl3.loopThroughNextDays(diff);
         }
  
         //6 lines
         if(childElemCount > 35 && childElemCount <= 42 ) {
          let diff = 42 - childElemCount;
          calendarControl3.loopThroughNextDays(42 - childElemCount);
         }
  
        },
        loopThroughNextDays: function(count) {
          if(count > 0) {
              for(let i=1;i<=count;i++) {
                  document.querySelector('.calendar-body3').innerHTML += `<div class="next-dates3">${i}</div>`;
              }
          }
        },
        attachEventsOnNextPrev: function () {
          calendarControl3.plotDates();
          calendarControl3.attachEvents();
        },
        selectDate: function (e) {
          let selectedDate = e.target.textContent;
          let formattedDate = `${selectedDate}-${calendarControl3.calMonthName[calendar.getMonth()]}-${calendar.getFullYear()}`;
          document.querySelector(".txtDat3").textContent = formattedDate;
      },
        init: function () {
          calendarControl3.plotSelectors();
          calendarControl3.plotDates();
          calendarControl3.attachEvents();
          let todayDateObj = new Date();
          let todayDay = String(todayDateObj.getDate()).padStart(2, '0');
          let todayMonth = String(todayDateObj.getMonth() + 1).padStart(2, '0'); // January is 0!
          let todayYear = todayDateObj.getFullYear();
          let todayDate = `${todayYear}-${todayMonth}-${todayDay}`;
          document.querySelector(".txtDat3").textContent = todayDate;
          console.log("ToDay Date productPopular for day:", todayDate);
          fetchDataremainingProduct(null, todayDate)
        },
         
      };
      calendarControl3.init();
    }
    const calendarControl3 = new CalendarControl3();

      //ฟังก์ชั่นเเปลงวันที่
  document.querySelector('.calendar3').addEventListener('click', function(event) {
    if (event.target.classList.contains('dateNumber3')) {
        let formattedDate = document.querySelector(".txtDat3").textContent; // ดึงข้อมูลวันที่ที่ได้รูปแบบแล้ว
        let dateParts = formattedDate.split('-'); // แยกส่วนวันที่ เช่น ["27", "Mar", "2023"]

        // แปลงชื่อเดือนเป็นหมายเลข
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthIndex = monthNames.indexOf(dateParts[1]) + 1; // หาดัชนีของเดือนและเพิ่ม 1 เพื่อให้ได้ตัวเลขเดือนที่ถูกต้อง

        // รูปแบบวันที่ให้เป็น YYYY-MM-DD
        const selectedDate = `${dateParts[2]}-${('0' + monthIndex).slice(-2)}-${('0' + dateParts[0]).slice(-2)}`;
        const todayDate = `${dateParts[2]}-${('0' + monthIndex).slice(-2)}-${('0' + dateParts[0]).slice(-2)}`;

        fetchDataremainingProduct(selectedDate, todayDate);
        console.log("Selected Date:", selectedDate);
        console.log("Today Date:",  todayDate);
    }
}); */

function fetchDataremainingProduct(todayDate) {
  console.log("Fetching data and plotting Bar graph for:", todayDate);
  const remainingforDay = `http://localhost:3443/remainingforDay?date=${todayDate}`;
  console.log("remainingforDayforDay :", remainingforDay);

  fetch(remainingforDay)
      .then(response => response.json())
      .then(data => {
          console.log("remainingforDay:", data);
          bargarph(data)
      })
      .catch(error => {
          console.error('Failed to fetch data:', error);
      });
}

function bargarph(data) {
  // Check if the data is empty
  if (data.length === 0) {
      console.warn("No data available for the selected day.");

      // Render an empty bar graph with a placeholder label
      const ctx = document.getElementById('barChart').getContext('2d');
      if (window.myChart instanceof Chart) {
          window.myChart.destroy();
      }

      window.myChart = new Chart(ctx, {
          type: 'bar',
          data: {
              labels: ['No Data'],
              datasets: [{
                  label: 'ยอดคงเหลือในคลัง',
                  data: [0],
                  backgroundColor: 'rgba(200, 200, 200, 0.6)',
                  borderColor: 'rgba(200, 200, 200, 1)',
                  borderWidth: 1
              }]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                  legend: {
                      display: true,
                      position: 'top'
                  }
              },
              scales: {
                  y: {
                      beginAtZero: true
                  }
              }
          }
      });
      return;
  }

  // Generate chart if data is available
  const labels = data.map(item => item.productName);
  const dataPoints = data.map(item => item.remainingQuantity);

  const colors = generateColors(data.length);

  const ctx = document.getElementById('barChart').getContext('2d');

  window.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [{
              label: 'ยอดคงเหลือในคลัง',
              data: dataPoints,
              backgroundColor: colors,
              borderColor: colors.map(color => color.replace('0.6', '1')),
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              legend: {
                  display: true,
                  position: 'top'
              }
          },
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}


function generateColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
      const randomColor = `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`;
      colors.push(randomColor);
  }
  return colors;
}
