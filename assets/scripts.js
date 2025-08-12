document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Course filtering functionality
    const filterCourses = () => {
        const year = document.getElementById('yearFilter').value;
        const term = document.getElementById('termFilter').value;
        const courses = document.querySelectorAll('#coursesList tr');

        courses.forEach(course => {
            const courseYear = course.getAttribute('data-year');
            const courseTerm = course.getAttribute('data-term');
            
            if ((year === 'all' || courseYear === year) && 
                (term === 'all' || courseTerm === term)) {
                course.style.display = '';
            } else {
                course.style.display = 'none';
            }
        });
    };

    // Add event listeners to filters
    document.getElementById('yearFilter')?.addEventListener('change', filterCourses);
    document.getElementById('termFilter')?.addEventListener('change', filterCourses);

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add animation classes to elements when they become visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    });

    document.querySelectorAll('.card, .table, .course-summary').forEach((el) => {
        observer.observe(el);
    });
});