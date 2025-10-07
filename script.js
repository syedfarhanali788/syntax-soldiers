document.addEventListener('DOMContentLoaded', () => {
    // Unique identifier for localStorage (simulating a logged-in user)
    const userId = 'user_priya_sharma_123'; 
    const progressKey = `edtech_progress_${userId}`;
    const themeKey = 'theme-preference';
    const totalLessons = 5;

    // --- DATA STRUCTURES ---
    const lessons = [
        { id: 1, title: "Introduction to Force and Motion", type: "Video Lesson" },
        { id: 2, title: "Lever: The Simplest Machine", type: "Interactive Quiz" },
        { id: 3, title: "Pulley Systems: Lifting Heavy Loads", type: "Simulation (Lite)" },
        { id: 4, title: "The Inclined Plane and Wedge", type: "Reading Material" },
        { id: 5, title: "Module Test: Simple Machines", type: "Assessment" }
    ];

    const teacherData = [
        { name: "Priya Sharma", progress: 60, lastActive: "Today", score: 78 },
        { name: "Amit Kumar", progress: 100, lastActive: "Yesterday", score: 92 },
        { name: "Reema Singh", progress: 20, lastActive: "3 Days Ago", score: 55 },
        { name: "Sunil Yadav", progress: 80, lastActive: "Today", score: 85 },
    ];

    // Load progress from local storage, or initialize if none exists
    let studentProgress = JSON.parse(localStorage.getItem(progressKey)) || {};

    // --- DOM Elements ---
    const lessonListElement = document.getElementById('lesson-list');
    const progressPercentElement = document.getElementById('progress-percent');
    const progressRingElement = document.getElementById('progress-ring');
    const completedLessonsElement = document.getElementById('completed-lessons');
    const teacherTableElement = document.getElementById('student-progress-table');
    const htmlElement = document.documentElement; // For theme class toggle
    const themeToggle = document.getElementById('theme-toggle');
    const moonIcon = document.getElementById('moon-icon');
    const sunIcon = document.getElementById('sun-icon');
    const toggleRoleButton = document.getElementById('toggle-role');
    const studentDashboard = document.getElementById('student-dashboard');
    const teacherDashboard = document.getElementById('teacher-dashboard');
    const userRoleDisplay = document.getElementById('user-role-display');
    let isTeacher = false;

    // --- THEME TOGGLE LOGIC ---
    const setTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
            localStorage.setItem(themeKey, 'dark');
        } else {
            htmlElement.classList.remove('dark');
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
            localStorage.setItem(themeKey, 'light');
        }
    };

    // Apply theme on initial load (reads from localStorage or system preference)
    const currentTheme = localStorage.getItem(themeKey);
    if (currentTheme) {
        setTheme(currentTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark'); 
    } else {
        setTheme('light');
    }

    // Toggle handler
    themeToggle.addEventListener('click', () => {
        const newTheme = htmlElement.classList.contains('dark') ? 'light' : 'dark';
        setTheme(newTheme);
    });


    // --- STUDENT DASHBOARD FUNCTIONS ---

    // Function to save progress (simulating offline persistence)
    const saveProgress = () => {
        localStorage.setItem(progressKey, JSON.stringify(studentProgress));
        updateProgressDisplay();
    };

    // Function to calculate and update visual progress
    const updateProgressDisplay = () => {
        const completedCount = Object.values(studentProgress).filter(isCompleted => isCompleted).length;
        const percentage = Math.round((completedCount / totalLessons) * 100);
        
        progressPercentElement.textContent = `${percentage}%`;
        completedLessonsElement.textContent = completedCount;

        // Update the progress ring (Circumference: 2 * pi * 45 ≈ 282.7)
        const circumference = 282.7;
        const offset = circumference - (percentage / 100) * circumference;
        progressRingElement.style.strokeDashoffset = offset;
    };

    // Function to handle lesson click
    const handleLessonClick = (lessonId) => {
        const isCompleted = studentProgress[lessonId];
        
        // Toggle completion status
        studentProgress[lessonId] = !isCompleted;
        
        // Re-render the list to update visual status
        renderLessonList();
        
        // Save and update global progress
        saveProgress();
    };

    // Function to render the lesson list (Student View)
    const renderLessonList = () => {
        lessonListElement.innerHTML = '';
        lessons.forEach(lesson => {
            const isCompleted = studentProgress[lesson.id] || false;
            const completionClass = isCompleted ? 'bg-green-100 dark:bg-emerald-800 border-green-500' : 'bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600';
            const icon = isCompleted 
                ? '<svg class="w-5 h-5 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
                : '<svg class="w-5 h-5 text-indigo-500 dark:text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>';

            const lessonCard = document.createElement('div');
            lessonCard.className = `lesson-card flex justify-between items-center p-4 border-2 rounded-lg cursor-pointer transition duration-150 shadow-sm ${completionClass}`;
            lessonCard.dataset.lessonId = lesson.id;
            lessonCard.innerHTML = `
                <div class="flex items-center space-x-3">
                    ${icon}
                    <div>
                        <p class="text-sm font-medium text-gray-800 dark:text-gray-100">${lesson.title}</p>
                        <span class="text-xs text-gray-500 dark:text-gray-400">${lesson.type}</span>
                    </div>
                </div>
                <span class="text-xs font-semibold ${isCompleted ? 'text-green-600 dark:text-green-300' : 'text-orange-500 dark:text-orange-300'}">
                    ${isCompleted ? 'COMPLETED' : 'START LESSON'}
                </span>
            `;
            lessonCard.addEventListener('click', () => handleLessonClick(lesson.id));
            lessonListElement.appendChild(lessonCard);
        });
    };

    // --- TEACHER DASHBOARD FUNCTIONS ---

    // Function to render the teacher dashboard table
    const renderTeacherDashboard = () => {
        let tableHTML = `
            <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-600">
                <thead class="bg-gray-50 dark:bg-slate-700">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Student Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Progress (%)</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Score (Avg.)</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Last Active</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 dark:divide-slate-600">
        `;

        teacherData.forEach(student => {
            const progressColor = student.progress < 50 ? 'text-red-600 dark:text-red-400' : (student.progress < 80 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400');
            const scoreColor = student.score < 60 ? 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200' : 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200';

            tableHTML += `
                <tr class="hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">${student.name}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${progressColor} font-semibold">${student.progress}%</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${scoreColor}">
                            ${student.score}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${student.lastActive}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;
        teacherTableElement.innerHTML = tableHTML;
    };

    // --- ROLE TOGGLE LOGIC ---

    toggleRoleButton.addEventListener('click', () => {
        isTeacher = !isTeacher;

        if (isTeacher) {
            studentDashboard.classList.add('hidden');
            teacherDashboard.classList.remove('hidden');
            userRoleDisplay.textContent = 'Teacher';
            toggleRoleButton.textContent = 'Switch to Student View';
        } else {
            teacherDashboard.classList.add('hidden');
            studentDashboard.classList.remove('hidden');
            userRoleDisplay.textContent = 'Student';
            toggleRoleButton.textContent = 'Switch to Teacher View';
        }
    });


    // --- INITIALIZATION ---
    renderLessonList();
    updateProgressDisplay();
    renderTeacherDashboard(); 
});
