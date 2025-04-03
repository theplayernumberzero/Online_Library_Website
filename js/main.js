// Form Validation Functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function validateName(name) {
    return name.length >= 2;
}

// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let borrowedBooks = JSON.parse(localStorage.getItem('borrowedBooks')) || [];

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Update Cart Link Visibility
function updateCartLinkVisibility() {
    const cartLink = document.querySelector('.nav-link[href="buy.html"]');
    const currentPage = window.location.pathname.split('/').pop();
    
    // Hide cart link on login and signup pages
    if (currentPage === 'login.html' || currentPage === 'signup.html') {
        if (cartLink) {
            cartLink.parentElement.style.display = 'none';
        }
    } else {
        if (cartLink) {
            cartLink.parentElement.style.display = 'block';
        }
    }
}

// Update Complete Transaction Button Visibility
function updateCompleteTransactionButton() {
    const completeTransactionBtn = document.getElementById('completeTransaction');
    if (completeTransactionBtn) {
        if (cart.length > 0) {
            completeTransactionBtn.style.display = 'block';
        } else {
            completeTransactionBtn.style.display = 'none';
        }
    }
}

// Save Cart to LocalStorage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Form Submission Handlers
document.addEventListener('DOMContentLoaded', function() {
    // Update cart link visibility on page load
    updateCartLinkVisibility();
    
    // Update complete transaction button visibility
    updateCompleteTransactionButton();
    
    // Update cart UI on page load
    updateCartUI();
    
    // Button Click Handlers
    document.querySelectorAll('button, a').forEach(element => {
        element.addEventListener('click', function(e) {
            if (this.id === 'loginBtn') {
                showNotification('Giriş sayfasına yönlendiriliyorsunuz...', 'info');
            } else if (this.id === 'signupBtn') {
                showNotification('Kayıt sayfasına yönlendiriliyorsunuz...', 'info');
            } else if (this.classList.contains('borrow-btn')) {
                showNotification('Kitap sepete eklendi!', 'success');
            } else if (this.classList.contains('read-btn')) {
                showNotification('Kitap okuma sayfasına yönlendiriliyorsunuz...', 'info');
            } else if (this.id === 'completeTransaction') {
                showNotification('İşlem başarıyla tamamlandı!', 'success');
            } else if (this.id === 'logoutButton') {
                showNotification('Çıkış yapılıyor...', 'info');
            }
        });
    });

    // Signup Form Validation
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!validateName(firstName) || !validateName(lastName)) {
                showNotification('İsim ve soyisim en az 2 karakter olmalıdır.', 'warning');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Geçerli bir email adresi giriniz.', 'warning');
                return;
            }
            
            if (!validatePassword(password)) {
                showNotification('Şifre en az 6 karakter olmalıdır.', 'warning');
                return;
            }
            
            // Save user info to localStorage
            localStorage.setItem('user', JSON.stringify({
                firstName,
                lastName,
                email
            }));
            
            showNotification('Kayıt başarılı! Ana sayfaya yönlendiriliyorsunuz...', 'success');
            
            // Form is valid, redirect to main page
            setTimeout(() => {
                window.location.href = 'main_page.html';
            }, 2000);
        });
    }
    
    // Login Form Validation
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (!validateEmail(email)) {
                showNotification('Geçerli bir email adresi giriniz.', 'warning');
                return;
            }
            
            if (!validatePassword(password)) {
                showNotification('Şifre en az 6 karakter olmalıdır.', 'warning');
                return;
            }
            
            showNotification('Giriş başarılı! Ana sayfaya yönlendiriliyorsunuz...', 'success');
            
            // Form is valid, redirect to main page
            setTimeout(() => {
                window.location.href = 'main_page.html';
            }, 2000);
        });
    }
    
    // Toggle Password Visibility
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Borrow Button Click Handler
    document.querySelectorAll('.borrow-btn').forEach(button => {
        button.addEventListener('click', function() {
            const bookCard = this.closest('.book-card');
            const bookTitle = bookCard.querySelector('.card-title').textContent;
            const bookAuthor = bookCard.querySelector('.card-text').textContent;
            const bookImage = bookCard.querySelector('img').src;
            
            // Check if book is already borrowed
            if (borrowedBooks.includes(bookTitle)) {
                showNotification('Bu kitabı zaten ödünç almışsınız.', 'warning');
                return;
            }
            
            // Add to cart
            cart.push({
                title: bookTitle,
                author: bookAuthor,
                image: bookImage
            });
            
            // Save cart to localStorage
            saveCartToLocalStorage();
            
            // Update cart UI and button visibility
            updateCartUI();
            updateCompleteTransactionButton();
            
            // Disable borrow button
            this.disabled = true;
            this.classList.add('btn-secondary');
            this.textContent = 'Ödünç Alındı';
            
            showNotification('Kitap sepete eklendi!', 'success');
        });
    });
    
    // Read Button Click Handler
    document.querySelectorAll('.read-btn').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Kitap okuma sayfasına yönlendiriliyorsunuz...', 'info');
            // Redirect to PDF viewer
            setTimeout(() => {
                window.open('https://example.com/sample.pdf', '_blank');
            }, 1000);
        });
    });
    
    // Complete Transaction Button
    const completeTransactionBtn = document.getElementById('completeTransaction');
    if (completeTransactionBtn) {
        completeTransactionBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showNotification('Sepetinizde kitap bulunmamaktadır.', 'warning');
                return;
            }
            
            // Add books to borrowed books
            borrowedBooks = [...borrowedBooks, ...cart.map(book => book.title)];
            
            // Save to localStorage
            localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
            
            // Clear cart
            cart = [];
            updateCartUI();
            
            showNotification('Kitaplar başarıyla ödünç alındı!', 'success');
            
            // Redirect to profile page
            setTimeout(() => {
                window.location.href = 'profile.html';
            }, 2000);
        });
    }
    
    // Logout Button
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            // Clear user session
            localStorage.removeItem('user');
            localStorage.removeItem('borrowedBooks');
            
            showNotification('Çıkış yapılıyor...', 'info');
            
            // Redirect to signup page
            setTimeout(() => {
                window.location.href = 'signup.html';
            }, 2000);
        });
    }
    
    // Update Cart UI
    function updateCartUI() {
        const cartItems = document.getElementById('cartItems');
        const emptyCartMessage = document.getElementById('emptyCartMessage');
        
        if (cart.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'block';
            }
            if (cartItems) {
                cartItems.innerHTML = '';
            }
            // Reactivate all borrow buttons when cart is empty
            document.querySelectorAll('.borrow-btn').forEach(button => {
                button.disabled = false;
                button.classList.remove('btn-secondary');
                button.textContent = 'Ödünç Al';
            });
            return;
        }
        
        if (emptyCartMessage) {
            emptyCartMessage.style.display = 'none';
        }
        
        if (cartItems) {
            // Clear existing items
            cartItems.innerHTML = '';
            
            // Add new items
            cart.forEach((book, index) => {
                const bookElement = document.createElement('div');
                bookElement.className = 'card mb-3';
                bookElement.innerHTML = `
                    <div class="row g-0">
                        <div class="col-md-4 d-flex justify-content-center align-items-center">
                            <img src="${book.image}" class="img-fluid rounded-start" alt="${book.title}">
                        </div>
                        <div class="col-md-8">
                            <div class="card-body d-flex justify-content-between align-items-center">
                                <div>
                                    <h5 class="card-title">${book.title}</h5>
                                    <p class="card-text">${book.author}</p>
                                </div>
                                <button class="btn btn-danger cancel-btn" data-index="${index}">
                                    <i class="fas fa-times"></i> İptal Et
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                cartItems.appendChild(bookElement);
                
                // Add cancel button handler
                const cancelBtn = bookElement.querySelector('.cancel-btn');
                cancelBtn.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    const removedBook = cart[index];
                    
                    // Remove from cart array
                    cart.splice(index, 1);
                    
                    // Update localStorage
                    saveCartToLocalStorage();
                    
                    // Update UI
                    updateCartUI();
                    updateCompleteTransactionButton();
                    
                    // Reactivate the borrow button for this book
                    const bookTitle = removedBook.title;
                    document.querySelectorAll('.book-card').forEach(card => {
                        const title = card.querySelector('.card-title').textContent;
                        if (title === bookTitle) {
                            const borrowBtn = card.querySelector('.borrow-btn');
                            if (borrowBtn) {
                                borrowBtn.disabled = false;
                                borrowBtn.classList.remove('btn-secondary');
                                borrowBtn.textContent = 'Ödünç Al';
                            }
                        }
                    });
                    
                    showNotification('Kitap sepetten kaldırıldı!', 'info');
                });
            });
        }
        
        // Update complete transaction button visibility
        updateCompleteTransactionButton();
    }
    
    // Update Borrowed Books UI
    function updateBorrowedBooksUI() {
        const borrowedBooksContainer = document.getElementById('borrowedBooks');
        const noBooksMessage = document.getElementById('noBooksMessage');
        const borrowedCount = document.getElementById('borrowedCount');
        
        // Get borrowed books from localStorage
        const storedBooks = localStorage.getItem('borrowedBooks');
        if (storedBooks) {
            borrowedBooks = JSON.parse(storedBooks);
        }
        
        if (borrowedCount) {
            borrowedCount.textContent = borrowedBooks.length;
        }
        
        if (borrowedBooks.length === 0) {
            if (noBooksMessage) {
                noBooksMessage.style.display = 'block';
            }
            return;
        }
        
        if (noBooksMessage) {
            noBooksMessage.style.display = 'none';
        }
        
        // Clear existing items
        borrowedBooksContainer.innerHTML = '';
        
        // Add borrowed books
        borrowedBooks.forEach(bookTitle => {
            const bookElement = document.createElement('div');
            bookElement.className = 'card mb-3';
            bookElement.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${bookTitle}</h5>
                    <button class="btn btn-warning return-btn">Teslim Et</button>
                </div>
            `;
            borrowedBooksContainer.appendChild(bookElement);
            
            // Add return button handler
            const returnBtn = bookElement.querySelector('.return-btn');
            returnBtn.addEventListener('click', function() {
                // Remove book from borrowed books
                borrowedBooks = borrowedBooks.filter(title => title !== bookTitle);
                localStorage.setItem('borrowedBooks', JSON.stringify(borrowedBooks));
                
                // Update UI
                updateBorrowedBooksUI();
                
                showNotification('Kitap başarıyla teslim edildi!', 'success');
            });
        });
    }
    
    // Initialize borrowed books UI
    updateBorrowedBooksUI();
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
    
    // Add fade-in animation to elements
    document.querySelectorAll('.fade-in').forEach(element => {
        element.style.opacity = '0';
        setTimeout(() => {
            element.style.opacity = '1';
        }, 100);
    });
}); 