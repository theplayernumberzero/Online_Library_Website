function addBookToCart(bookId){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingBook = cart.find(book => book.id === bookId);

    if (!existingBook) {
        cart.push({ id: bookId });
        localStorage.setItem('cart', JSON.stringify(cart));
        showNotification(`The book added to cart!`, 'success');
    }
    else{
        showNotification(`The book has already been added to cart!`, 'warning');
    }
}

function authControl(){
    if(localStorage.getItem('token') == null){
        document.getElementById('authButtonContainer').innerHTML = `<a class="nav-link" href="login.html">Login</a>`;
    }else{
        document.getElementById('authButtonContainer').innerHTML = `<a class="nav-link" href="#" id="logoutButton" onclick="Logout()">Logout</a>`;
    }
}

function Logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('token');

    window.location.href = 'login.html';
}


function showBookDetails(id) {
    fetch(`https://localhost:7122/api/books/${id}`)
        .then(response => response.json())
        .then(data => {
            let book = data.value;
            console.log(data);
            document.getElementById("bookImage").src = "data:image/jpeg;base64," + book.imageBase64;
            document.getElementById("bookTitle").innerText = book.name;
            document.getElementById("bookAuthor").innerText = book.authorName;
            document.getElementById("numberOfPages").innerText = book.numberOfPages;
            document.getElementById("bookCategory").innerText = book.categories.join(", ");
            document.getElementById("bookDescription").innerText = book.description;

            let buttonGroup = document.getElementById("buttonGroup");
            buttonGroup.innerHTML = `
                    <button class="btn btn-primary" onclick="addBookToCart('${book.id}')">Add to cart</button>
                    ${book.isEbook
                        ? `<a href="${book.eBookUrl}" class="btn btn-outline-primary read-btn" target="_blank">Read Online</a>`
                        : `<button class="btn btn-outline-secondary" disabled>Read Online</button>`
                    }
                `;
        })
        .catch(error => {
            showNotification("An error occurred while fetching book details. " + error.message, 'danger');
        });

    if(localStorage.getItem("token") !=null){
        fetch(`https://localhost:7122/api/BookRating/GetBookRatingByUser/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            }
        })
        .then(response => {
            if(response.status == 401){
                window.location.href = 'login.html';
            }
            else if(!response.ok){
                showNotification("An error occurred while fetching book details." , 'danger');
            }
            return response.json();
        })
        .then(data => {
            let rating = data.value;
            if (rating) {
                updateStars(rating.star);
            } else {
                updateStars(0);
            }
        });
    }
    const modal = new bootstrap.Modal(document.getElementById("bookDetailModal"));
    modal.show();

    document.querySelectorAll(".fa-star").forEach(star => {
        const newStar = star.cloneNode(true);
        star.parentNode.replaceChild(newStar, star);

        newStar.addEventListener("click", function() {
            const rating = parseInt(star.getAttribute("data-rating"));
            fetch(`https://localhost:7122/api/BookRating`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    bookId: id,
                    star: rating
                })
            })
            .then(response=>response.json())
            .then(data => {
                console.log(data);
                if(data.StatusCode == 401){
                    window.location.href = 'login.html';
                }else if(data.StatusCode == 400){
                    var errors="<ul>";
                    data.Errors.forEach(error => {
                        errors += `<li>${error}</li>`;
                    });
                    errors += "</ul>";
                    showNotification(errors, "danger");
                }else{
                    showNotification("Your rating has been submitted successfully!" , 'success');
                    updateStars(rating);
                }
            })
            .catch(error => {
                showNotification("An error occurred while submitting your rating. " + error.message, 'danger');
            });
        });
    })
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateStars(rating) {
    const stars = document.querySelectorAll('#starRating i');

    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.remove('fa-regular');
            star.classList.add('fa-solid');
        } else {
            star.classList.remove('fa-solid');
            star.classList.add('fa-regular');
        }
    });
}