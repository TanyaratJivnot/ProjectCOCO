/* dropdown */
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach(dropdown => {
    const select =  dropdown.querySelector('.select');
    const caret =  dropdown.querySelector('.caret');
    const menu_dropdown =  dropdown.querySelector('.menu_dropdown');
    const options =  dropdown.querySelectorAll('.menu_dropdown li');
    const selected =  dropdown.querySelector('.selected');

    select.addEventListener('click', ()=>{
        select.classList.toggle('select-clicked');
        caret.classList.toggle('caret-rotate');
        menu_dropdown.classList.toggle('menu-open');
    });

    options.forEach(option => {
        option.addEventListener('click', ()=>{
            selected.innerText = option.innerText;
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu_dropdown.classList.remove('menu-open');

            options.forEach(option => {
                option.classList.remove('active');
            })
            option.classList.add('active');
        });
    });
});

document.getElementById('file-input').addEventListener('change', function() {
    if (this.files && this.files[0]) {
        var img = document.getElementById('image-preview');  // Get the image preview tag
        var defaultImg = document.getElementById('default-image'); // Get the default image tag
        img.src = URL.createObjectURL(this.files[0]); // Set the image preview src to the selected file
        img.onload = function() {
            URL.revokeObjectURL(img.src); // Free memory after loading the image
        }
        img.style.display = 'block'; // Make the image preview visible
        defaultImg.style.display = 'none'; // Hide the default image
    }
});
/* สุ่มบาร์โค้ด */
document.addEventListener('DOMContentLoaded', function () {
    // เมื่อเอกสารโหลดเสร็จสมบูรณ์ ค้นหาปุ่มและเพิ่ม event listener
    var btn = document.querySelector('.btn-success');
    btn.addEventListener('click', function () {
        var randomNumber = generateRandomNumber(13);
        var inputField = document.querySelector('.box_bar .form-control');
        inputField.value = randomNumber;  // ตั้งค่า input field ด้วยตัวเลขสุ่ม
    });
});
$(document).ready(function() {
    // When a category is clicked
    $('.menu_dropdown li').click(function() {
        // Get the text of the clicked category
        var selectedCategory = $(this).text();

        // Set the hidden input's value to the selected category
        $('#categoryName').val(selectedCategory);

        // Update the displayed selected category (optional, for UI purposes)
        $('.select .selected').text(selectedCategory);

        // Hide the dropdown (optional, based on your UI logic)
        // ... your code to hide the dropdown ...
    });
});

function generateRandomNumber(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
/* validate product */
$(document).ready(function() {
    $('#btn_update').click(function(e) {
        e.preventDefault(); // Prevent the default button click action

        var isValid = true; // Start assuming the form is valid
        
        // Validate text inputs
        $('#product-form input[type="text"][required], #product-form input[type="number"][required]').each(function() {
            if ($(this).val().trim() === '') {
                isValid = false;
                $(this).next('span#error').text('This field is required').show(); // Show error message
            } else {
                $(this).next('span#error').hide(); // Hide error message
            }
        });

        // Validate dropdown
        if ($('.select .selected').text().trim() === '') {
            isValid = false;
            $('.select').next('span#error').text('Please select a category').show();
        } else {
            $('.select').next('span#error').hide();
        }

        // Validate file input
        if ($('#file-input').val().trim() === '') {
            isValid = false;
            $('#file-input').next('span#error').text('Please upload an image').show();
        } else {
            $('#file-input').next('span#error').hide();
        }

        if (isValid) {
            $('#product-form').submit(); // Submit the form if all validations are passed
        }
    });

    // Reset error messages when user starts typing or selects a file
    $('#product-form input[type="text"], #product-form input[type="number"], #file-input').on('input', function() {
        $(this).next('span#error').hide();
    });

    // Reset error message when a category is selected
    $('.menu_dropdown li').click(function() {
        $('.select').next('span#error').hide();
    });
});

/* alert */
function togglePopup(){
    document.getElementById("popup-1").classList.toggle("active");
}