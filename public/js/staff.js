
window.onload = () => {
    if (window.performance) {
        if (performance.navigation.type === 1) {
            // หน้าเว็บถูกรีเฟรช, ลบข้อความข้อผิดพลาด
            document.querySelectorAll('.error-message').forEach((elem) => {
                elem.style.display = 'none';
            });
        }
    }
};
function togglePopup(id = null) {
    if (id) {
        document.getElementById('employeeIdToDelete').value = id;
    }
    document.getElementById("popup-1").classList.toggle("active");
}

function deleteEmployee() {
    const id = document.getElementById('employeeIdToDelete').value;
    fetch('/staff/delete/' + id, {
        method: 'DELETE'
    }).then(response => response.json())
    .then(data => {
        // Handle the response data
        if (data.success) {
            window.location.reload(); // Reload the page to update the list
        } else {
            alert('Error deleting employee');
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



