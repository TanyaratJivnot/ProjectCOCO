document.addEventListener('DOMContentLoaded', function() {
  // Setup for first button and calendar
  var calendarButton1 = document.getElementById('calenda');
  var calendarDiv1 = document.getElementById('calendarDiv1');

    // Toggle the calendar display on button click
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

/* ตัวปฏิทิน */
function CalendarControl() {
  const calendar = new Date();
  this.localDate = new Date();
  this.currentYear = this.localDate.getFullYear();
  this.currentMonth = this.localDate.getMonth();  // 0-indexed
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
        let yearLabel = document.querySelector(".calendar .calendar-year-label");
        yearLabel.innerHTML = calendar.getFullYear();
      },
      displayMonth: function () {
        let monthLabel = document.querySelector(
          ".calendar .calendar-month-label"
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
          ".calendar"
        ).innerHTML += `<div class="calendar-inner"><div class="calendar-controls">
          <div class="calendar-prev"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M88.2 3.8L35.8 56.23 28 64l7.8 7.78 52.4 52.4 9.78-7.76L45.58 64l52.4-52.4z"/></svg></a></div>
          <div class="calendar-year-month">
          <div class="calendar-month-label"></div>
          <div>-</div>
          <div class="calendar-year-label"></div>
          </div>
          <div class="calendar-next"><a href="#"><svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><path fill="#666" d="M38.8 124.2l52.4-52.42L99 64l-7.77-7.78-52.4-52.4-9.8 7.77L81.44 64 29 116.42z"/></svg></a></div>
          </div>
          <div class="calendar-today-date"> 
           
          </div>
          <div class="calendar-body"></div></div>`;
      },
      plotSelectors1: function () {
        document.querySelector(
          ".txtDat"
        ).innerHTML += `
        ${calendarControl.localDate.getDate()}-
        ${calendarControl.calMonthName[calendarControl.localDate.getMonth()]}- 
        ${calendarControl.localDate.getFullYear()}   
        `;
      },
      plotDayNames: function () {
        for (let i = 0; i < calendarControl.calWeekDays.length; i++) {
          document.querySelector(
            ".calendar .calendar-body"
          ).innerHTML += `<div>${calendarControl.calWeekDays[i]}</div>`;
        }
      },
      plotDates: function () {
        document.querySelector(".calendar .calendar-body").innerHTML = "";
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
              ".calendar .calendar-body"
            ).innerHTML += `<div class="prev-dates"></div>`;
            prevMonthDatesArray.push(calendarControl.prevMonthLastDate--);
          } else {
            document.querySelector(
              ".calendar .calendar-body"
            ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
          }
        }
        //remaining dates after month dates
        for (let j = 0; j < prevDateCount + 1; j++) {
          document.querySelector(
            ".calendar .calendar-body"
          ).innerHTML += `<div class="number-item" data-num=${count}><a class="dateNumber" href="#">${count++}</a></div>`;
        }
        calendarControl.highlightToday();
        calendarControl.plotPrevMonthDates(prevMonthDatesArray);
        calendarControl.plotNextMonthDates();
      },
      attachEvents: function () {
        let prevBtn = document.querySelector(".calendar .calendar-prev a");
        let nextBtn = document.querySelector(".calendar .calendar-next a");
        let todayDate = document.querySelector(".calendar .calendar-today-date");
        let dateNumber = document.querySelectorAll(".calendar .dateNumber");
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
          document.querySelectorAll(".number-item")
        ) {
          document
            .querySelectorAll(".number-item")
            [calendar.getDate() - 1].classList.add("calendar-today");
        }
      },
      plotPrevMonthDates: function(dates){
        dates.reverse();
        for(let i=0;i<dates.length;i++) {
            if(document.querySelectorAll(".prev-dates")) {
                document.querySelectorAll(".prev-dates")[i].textContent = dates[i];
            }
        }
      },
      plotNextMonthDates: function(){
       let childElemCount = document.querySelector('.calendar-body').childElementCount;
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
                document.querySelector('.calendar-body').innerHTML += `<div class="next-dates">${i}</div>`;
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
        document.querySelector(".txtDat").textContent = formattedDate;
        console.log("Formatted Date:", formattedDate);
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
        document.querySelector(".txtDat").textContent = todayDate;
        console.log("ToDay Date:", todayDate);
        fetchDataAndPlotGraph(null, todayDate);
        fetchData(todayDate);
        ProductPopularToday(todayDate);
        /* 2-4 */
        fetchDataRankSalesEmployee(null,todayDate);
        fetchDataremainingProduct(todayDate);
        fetchDatapopularProduct(null,todayDate);
      },
       
    };
    calendarControl.init();

  }
  const calendarControl = new CalendarControl();


  document.querySelector('.calendar').addEventListener('click', function(event) {
    if (event.target.classList.contains('dateNumber')) {
        let formattedDate = document.querySelector(".txtDat").textContent; // ดึงข้อมูลวันที่ที่ได้รูปแบบแล้ว
        let dateParts = formattedDate.split('-'); // แยกส่วนวันที่ เช่น ["27", "Mar", "2023"]

        // แปลงชื่อเดือนเป็นหมายเลข
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let monthIndex = monthNames.indexOf(dateParts[1]) + 1; // หาดัชนีของเดือนและเพิ่ม 1 เพื่อให้ได้ตัวเลขเดือนที่ถูกต้อง

        // รูปแบบวันที่ให้เป็น YYYY-MM-DD
        const selectedDate = `${dateParts[2]}-${('0' + monthIndex).slice(-2)}-${('0' + dateParts[0]).slice(-2)}`;
        const todayDate = `${dateParts[2]}-${('0' + monthIndex).slice(-2)}-${('0' + dateParts[0]).slice(-2)}`;

        fetchDataAndPlotGraph(selectedDate, todayDate); // Pass selected date and today's date
        fetchData(todayDate); 
        ProductPopularToday(todayDate)
        console.log("Selected Date:", selectedDate);
        console.log("Today Date:",  todayDate);
        fetchDataRankSalesEmployee(selectedDate,todayDate);
        fetchDataremainingProduct(todayDate);
        fetchDatapopularProduct(selectedDate,todayDate);

    }
});


function fetchDataAndPlotGraph (selectedDate, todayDate) {
  console.log("Fetching data and plotting graph for:", selectedDate);
  const dateToFetch = selectedDate || todayDate; // Use selected date if available, otherwise use today's date
  const salesDataUrl = `/sales-data?date=${dateToFetch}`;
  const homeDataUrl = `/totalSale?date=${dateToFetch}`;

  console.log("Sales data URL:", salesDataUrl);
  console.log("Home data URL:", homeDataUrl);

  // Fetch sales total and update DOM
  fetch(homeDataUrl)
      .then(response => response.json())
      .then(data => {
          console.log("data for salesTotalAmount:",data);
          if (data && data.length > 0) {
            const totalsales = data.map(item => item.salesTotalAmount).reduce((a, b) => a + b, 0);
            document.getElementById('Sales').innerText = `${totalsales} ฿`;
        } else {
            document.getElementById('Sales').innerText = "0 ฿"; // Display 0 if there is no data or data is empty
        }
      })
      .catch(error => {
          console.error('Error fetching home data:', error);
      });
  // Fetch sales data for the graph
  fetch(salesDataUrl)
      .then(response => response.json())
      .then(data => {
          console.log("Data received for graph:", data);
          plotGraph(data); // Plot graph using the received data
          
      })
      .catch(error => {
          console.error('Error fetching sales data:', error);
          plotEmptyGraph(); // Plot empty graph on error
      });
}

function fetchData(todayDate) {
  console.log("Fetching data and plotting graph for:", todayDate);
  const todayDateUrl = `/sales-today?date=${todayDate}`;
  fetch(todayDateUrl)
  .then(response => response.json())
  .then(data => {
      console.log("data for salesTotalAmountToday:",data);
      if (data && data.length > 0) {
        const totalsales = data.map(item => item.salesTotalAmount).reduce((a, b) => a + b, 0);
        document.getElementById('toDaySales').innerText = `${totalsales} ฿`;
    } else {
        document.getElementById('toDaySales').innerText = "0 ฿"; // Display 0 if there is no data or data is empty
    }
  })
  .catch(error => {
      console.error('Error fetching home data:', error);
  });
}

function ProductPopularToday(todayDate) {
  console.log("Fetching data and plotting graph for:", todayDate);
  const ProductPopularUrl = `/productPopular?date=${todayDate}`;  // ตรวจสอบให้แน่ใจว่า URL ถูกต้อง

  fetch(ProductPopularUrl)
  .then(response => response.json())
  .then(data => {
      console.log("Data for ProductPopularToday:", data);
        const productName = data[0].NameProduct;  // ชื่อสินค้าที่ขายดีที่สุด
        const totalSales = data[0].totalSold;  // ยอดขายทั้งหมดของสินค้าที่ขายดีที่สุด
        console.log("productName:",productName);
        console.log("totalSale:",totalSales);
        document.getElementById("popularproductSales").innerText = `${productName} : ${totalSales} ชิ้น`;
  })
  .catch(error => {
      console.error('Error fetching popular product data:', error);
  });
}

/* 2-4 */
function fetchDataRankSalesEmployee(selectedDate,todayDate) {
  const dateToFetch = selectedDate || todayDate;
  console.log("Fetching data and Rank for:", dateToFetch);
  const RankSalesEmployeeUrl = `/employeeSales?date=${dateToFetch}`;
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
function fetchDataremainingProduct(todayDate) {
  console.log("Fetching data remaining Bar graph for:", todayDate);
  const remainingforDay = `/remainingforDay?date=${todayDate}`;
  console.log("remaining for Day Url :", remainingforDay);

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
function fetchDatapopularProduct(selectedDate,todayDate) {
  const dateToFetch = selectedDate || todayDate;
  console.log("Fetching data and popularProduct graph for:", dateToFetch);
  const productPopularforDay = `/productPopular5?date=${dateToFetch}`;
  console.log("productPopularUrl:", productPopularforDay);

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




function plotGraph(data) {
  const ctx = document.getElementById('myChart').getContext('2d');

  // Destroy the existing chart if it exists
  if (window.myChart1 && window.myChart1 instanceof Chart) {
      window.myChart1.destroy();
  }

  const labels = data.map(item => item.NameProduct);
  const dataPoints = data.map(item => item.Total_Amount);

  // Create a new chart instance
  window.myChart1 = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: [{
              label: 'ยอดขาย(จำนวนชิ้น)',
              data: dataPoints,
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}
function plotEmptyGraph() {
  const ctx = document.getElementById('myChart').getContext('2d');

  // Destroy the existing chart instance if it exists
  if (window.myChart2 && window.myChart2 instanceof Chart) {
      window.myChart2.destroy();
  }

  // Create a new chart instance with empty data
  window.myChart2 = new Chart(ctx, {
      type: 'line',
      data: {
          labels: [],
          datasets: [{
              label: 'ยอดขาย(จำนวนชิ้น)',
              data: [],
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2
          }]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  });
}


/* pieChart */

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
  if (window.pieChart && window.pieChart instanceof Chart) {
    window.pieChart.destroy();
}
  window.pieChart = new Chart(ctx, {
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


/* bar chart */ 
function bargarph(data) {
  const ctx = document.getElementById('barChart').getContext('2d');

  // Destroy the existing chart if it exists
  if (window.myBarChart && window.myBarChart instanceof Chart) {
      window.myBarChart.destroy();
  }

  // Handle the case where there's no data
  if (data.length === 0) {
      console.warn("No data available for the selected day.");

      window.myBarChart = new Chart(ctx, {
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

  const labels = data.map(item => item.productName);
  const dataPoints = data.map(item => item.remainingQuantity);
  const colors = generateColors(data.length);

  // Create a new chart instance
  window.myBarChart = new Chart(ctx, {
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


/* employee */
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






