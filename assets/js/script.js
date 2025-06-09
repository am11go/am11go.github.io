// Ждем, пока вся HTML-структура страницы (DOM) будет полностью загружена и готова к взаимодействию.
document.addEventListener('DOMContentLoaded', function () {

    // --- СКРИПТ 1: Мобильное меню (гамбургер) и выпадающие списки ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNavUl = document.querySelector('.main-nav ul');
    const dropdownItems = document.querySelectorAll('.main-nav .has-dropdown > a');

    if (menuToggle && mainNavUl) {
        menuToggle.addEventListener('click', function () {
            mainNavUl.classList.toggle('active');
        });
    }
    
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            if (window.getComputedStyle(menuToggle).display !== 'none') {
                e.preventDefault(); 
                const parentLi = this.parentElement;
                parentLi.parentElement.querySelectorAll('.has-dropdown.active').forEach(openItem => {
                    if (openItem !== parentLi) {
                        openItem.classList.remove('active');
                    }
                });
                parentLi.classList.toggle('active');
            }
        });
    });

    // --- СКРИПТ 2: Слайдер для галереи ---
    const sliders = document.querySelectorAll('.slider-container');
    sliders.forEach(slider => {
        const track = slider.querySelector('.slider-track');
        if (!track || !track.children.length) return;
        
        const slides = Array.from(track.children);
        const nextButton = slider.querySelector('.next-btn');
        const prevButton = slider.querySelector('.prev-btn');
        
        let currentIndex = 0;
        let slideWidth = 0;
        let visibleSlides = 4;

        function setSliderParams() {
            const wrapperWidth = slider.querySelector('.slider-wrapper').offsetWidth;
            
            if (window.innerWidth <= 768) {
                visibleSlides = 1;
            } else if (window.innerWidth <= 1024) {
                visibleSlides = 2;
            } else {
                visibleSlides = 4;
            }
            
            slideWidth = wrapperWidth / visibleSlides;
            slides.forEach(slide => {
                 slide.style.minWidth = `calc(${100 / visibleSlides}% - 10px)`;
            });
            updateSlidePosition(false); // No animation on resize
        }

        const updateSlidePosition = (animate = true) => {
            track.style.transition = animate ? 'transform 0.5s ease-in-out' : 'none';
            const maxIndex = Math.max(0, slides.length - visibleSlides);
            if (currentIndex > maxIndex) currentIndex = 0;
            if (currentIndex < 0) currentIndex = maxIndex;
            
            const offset = (track.querySelector('.slide').offsetWidth + 10) * currentIndex; 
            track.style.transform = `translateX(-${offset}px)`;
        };

        nextButton.addEventListener('click', () => {
            currentIndex++;
            updateSlidePosition();
        });

        prevButton.addEventListener('click', () => {
            currentIndex--;
            updateSlidePosition();
        });
        
        let autoPlayInterval = setInterval(() => {
             if (document.hasFocus()) { nextButton.click(); }
        }, 5000);

        slider.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
        slider.addEventListener('mouseleave', () => {
            autoPlayInterval = setInterval(() => {
                if (document.hasFocus()) { nextButton.click(); }
            }, 5000);
        });

        window.addEventListener('resize', setSliderParams);
        setSliderParams();
    });
    
    // --- СКРИПТ 3: Всплывающее окно (Pop-up) ---
    const popup = document.getElementById('popup-form');
    const openPopupButtons = document.querySelectorAll('.open-popup');
    const closePopupButton = document.querySelector('.popup-close');

    openPopupButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            popup.style.display = 'block';
        });
    });

    if(closePopupButton) {
        closePopupButton.addEventListener('click', () => {
            popup.style.display = 'none';
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target == popup) {
            popup.style.display = 'none';
        }
    });
    
    // --- СКРИПТ 4: "Ленивая" загрузка изображений (JS) ---
    const lazyImages = document.querySelectorAll('img.lazy');
    const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    lazyImages.forEach(img => lazyImageObserver.observe(img));

    // --- СКРИПТ 5: Лупа для сертификатов (уже сделано через CSS) ---
    // Для этого эффекта достаточно CSS-свойства transform: scale(), которое уже добавлено в styles.css.
    // JS здесь не требуется, но это демонстрация работы с изображениями.

});

// Используем jQuery $(function() { ... }), который является сокращением для $(document).ready()
// Это гарантирует, что DOM загружен, и jQuery готов к работе.
$(function() {
    
    // --- СКРИПТ 6: Плавная прокрутка к якорю (jQuery) ---
    $('.smooth-scroll').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            const hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 800, function(){
                window.location.hash = hash;
            });
        }
    });

    // --- СКРИПТ 7: Кнопка "Наверх" (jQuery) ---
    const backToTopButton = $('#back-to-top');
    $(window).scroll(function() {
        if ($(this).scrollTop() > 300) {
            backToTopButton.fadeIn();
        } else {
            backToTopButton.fadeOut();
        }
    });
    backToTopButton.on('click', function(e) {
        e.preventDefault();
        $('html, body').animate({scrollTop: 0}, '300');
    });

    // --- СКРИПТ 8: AJAX отправка формы (jQuery) ---
    $('#ajax-form').on('submit', function(e) {
        e.preventDefault();
        const form = $(this);
        const messageBox = form.find('.form-message');
        
        // Симуляция отправки
        messageBox.text('Спасибо! Ваша заявка отправлена. Мы скоро свяжемся с вами.').css('color', 'green').slideDown();
        form.find('button[type="submit"]').prop('disabled', true);

        setTimeout(function() {
            messageBox.slideUp();
            form.trigger('reset'); // Очистка полей формы
            form.find('button[type="submit"]').prop('disabled', false);
            $('#popup-form').fadeOut(); // Закрытие модального окна
        }, 4000);
    });
    
    // --- СКРИПТ 9: Аккордеон для "Почему мы" (jQuery UI) ---
    $("#accordion").accordion({
        heightStyle: "content", // Высота панели подстраивается под контент
        collapsible: true,      // Можно свернуть все панели
        active: false           // Изначально все свернуты
    });

    // --- СКРИПТ 10: Выбор даты в форме (jQuery UI Datepicker) ---
    $("#popup-date").datepicker({
        dateFormat: "dd.mm.yy", // Формат даты
        minDate: 0,             // Нельзя выбрать прошедшую дату
        dayNamesMin: [ "Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб" ],
        monthNames: [ "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь" ]
    });
    
    // --- СКРИПТ 11: Всплывающие подсказки (jQuery UI Tooltip) ---
    $(document).tooltip({
        items: ".usp-item[title]",
        track: true, // Подсказка следует за курсором
        show: { effect: "fade", duration: 200 },
        hide: { effect: "fade", duration: 200 }
    });
    
    // --- СКРИПТ 12: Интерактивные точки на карте ---
    // Логика реализована через HTML/CSS (hover), JS не требуется. Это пример того, как можно решать задачи разными способами.

    // --- СКРИПТ 13: Баннер о Cookie (jQuery) ---
    const cookieBanner = $('#cookie-banner');
    if (!localStorage.getItem('cookieAccepted')) {
        cookieBanner.show();
    }
    $('#cookie-accept').on('click', function() {
        localStorage.setItem('cookieAccepted', 'true');
        cookieBanner.fadeOut();
    });
});