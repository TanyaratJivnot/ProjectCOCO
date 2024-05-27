const wrapper = document.querySelector(".wrapper");
const carousel = document.querySelector(".carousel1");
const arrow_btn = document.querySelectorAll(".wrapper #left, #right");
const fistCardWidth = carousel.querySelector(".card").offsetWidth;
const carouselChild = [...carousel.children];

let isDragging = false,startX ,startScollLeft;
let cardPerView = Math.round(carousel.offsetWidth / fistCardWidth);

carouselChild.slice(-cardPerView).reverse().forEach(card =>{
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
})
carouselChild.slice(0, cardPerView).forEach(card =>{
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
})
arrow_btn.forEach(btn => {
    btn.addEventListener("click", ()=> {
        carousel.scrollLeft += btn.id === "left" ? -fistCardWidth : fistCardWidth;
    })
})

const dragStrat = (e) =>{
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScollLeft = carousel.scrollLeft;
}

const dragging = (e)=> {
    if(!isDragging) return;
    carousel.scrollLeft = startScollLeft - (e.pageX - startX);
}

const dragStop = () =>{
    isDragging = false;
    carousel.classList.remove("dragging")
}
const autoPlay = () =>{
    if(window.innerWidth < 800) return;
    timeoutId = setTimeout(() => carousel.scrollLeft += fistCardWidth, 500);
}
autoPlay();
const infiniteScoll = () =>{
    if(carousel.scrollLeft === 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth - (2*carousel.offsetWidth);
        carousel.classList.remove("no-transition");

    } 
    else if(carousel.scrollLeft === carousel.scrollWidth - carousel.offsetWidth){
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.scrollWidth;
        carousel.classList.remove("no-transition");

    }

    clearTimeout(timeoutId);
    if(!wrapper.matches(":hover")) autoPlay();
}

carousel.addEventListener("mousedown", dragStrat);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);
carousel.addEventListener("scorll", infiniteScoll);
wrapper.addEventListener("mouseenter", ()=> clearTimeout(timeoutId));
wrapper.addEventListener("mouseleave", autoPlay);


document.addEventListener('DOMContentLoaded', function() {
    // Sort Ascending
    document.getElementById('up').addEventListener('click', function() {
        window.location.href = '/stock?sort=asc';
    });

    // Sort Descending
    document.getElementById('down').addEventListener('click', function() {
        window.location.href = '/stock?sort=desc';
    });
});


window.onload = () => {
    if (window.performance) {
        if (performance.navigation.type === 1) {
            // The page was refreshed, clear any error messages
            document.querySelectorAll('.error-message').forEach((elem) => {
                elem.style.display = 'none';
            });
        }
    }
};
function togglePopup(id = null) {
    if (id) {
        document.getElementById('productIdToDelete').value = id;
    }
    document.getElementById("popup-1").classList.toggle("active");
}
function deleteProduct() {
    const id = document.getElementById('productIdToDelete').value;
    fetch('/product/delete/' + id, {
        method: 'DELETE'
    }).then(response => response.json())
    .then(data => {
        // Handle the response data
        if (data.success) {
            window.location.reload(); // Reload the page to update the list
        } else {
            alert('Error deleting product');
        }
    });

    // Hide the popup after the request is sent
    togglePopup();
}
/* ค้นหา */
window.onload = function() {
    // Check if there's a search term in the URL
    var searchTermPresent = window.location.search.includes('searchTerm');
    
    // If there is a search term, change the URL to '/staff'
    if (searchTermPresent) {
        var newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({path: newUrl}, '', newUrl);
    }
};
