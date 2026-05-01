document.addEventListener('DOMContentLoaded', () => {
    const nameModal = document.getElementById('name-modal');
    const nameInput = document.getElementById('name-input');
    const startBtn = document.getElementById('start-btn');
    const displayName = document.getElementById('display-name');
    const userProfile = document.getElementById('user-profile');
    
    const mcStreakBadge = document.getElementById('mc-streak-badge');
    const mcScoreBadge = document.getElementById('mc-score-badge');
    const mcQuestionText = document.getElementById('mc-question-text');
    const mcAnswerInput = document.getElementById('mc-answer-input');
    const mcCheckBtn = document.getElementById('mc-check-btn');
    const mcFeedbackText = document.getElementById('mc-feedback-text');
    const mcMouse = document.getElementById('mc-mouse');
    const mcCat = document.getElementById('mc-cat');
    
    const gradeSelect = document.getElementById('mc-grade-select');
    const topicSelect = document.getElementById('mc-topic-select');
    const levelSelect = document.getElementById('mc-level-select');

    let mcScore = 0;
    let mcStreak = 0;
    let mcCorrectAnswer = null;
    let mcConsecutiveCorrect = 0;

    // --- Name Logic ---
    const savedName = localStorage.getItem('playerName');
    if (savedName) {
        setPlayerName(savedName);
        nameModal.classList.remove('active');
        initGame();
    } else {
        nameInput.focus();
    }

    startBtn.addEventListener('click', () => {
        const name = nameInput.value.trim();
        if (name) {
            setPlayerName(name);
            localStorage.setItem('playerName', name);
            nameModal.style.opacity = '0';
            setTimeout(() => {
                nameModal.classList.remove('active');
                initGame();
            }, 300);
        } else {
            nameInput.style.transform = 'translateX(10px)';
            setTimeout(() => nameInput.style.transform = 'translateX(-10px)', 100);
            setTimeout(() => nameInput.style.transform = 'translateX(10px)', 200);
            setTimeout(() => nameInput.style.transform = 'translateX(0)', 300);
        }
    });

    nameInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') startBtn.click(); });
    function setPlayerName(name) { displayName.textContent = name; }

    userProfile.addEventListener('click', () => {
        const currentName = localStorage.getItem('playerName') || '';
        nameInput.value = currentName;
        nameModal.style.opacity = '1';
        nameModal.classList.add('active');
        setTimeout(() => nameInput.focus(), 100);
    });

    // --- Game Logic ---
    function initGame() {
        loadStreak();
        nextMathcatQuestion();
    }

    gradeSelect.addEventListener('change', () => {
        mcConsecutiveCorrect = 0; // reset progress on grade change
        nextMathcatQuestion();
    });

    topicSelect.addEventListener('change', () => {
        mcConsecutiveCorrect = 0; // reset progress on topic change
        nextMathcatQuestion();
    });

    levelSelect.addEventListener('change', () => {
        mcConsecutiveCorrect = 0; // reset progress on level change
        nextMathcatQuestion();
    });

    function loadStreak() {
        mcStreak = parseInt(localStorage.getItem('mc_streak')) || 0;
        let lastPlayed = localStorage.getItem('mc_lastPlayed');
        let today = new Date();
        today.setHours(0,0,0,0);

        if (lastPlayed) {
            let lastDate = new Date(lastPlayed);
            lastDate.setHours(0,0,0,0);
            let diffTime = Math.abs(today - lastDate);
            let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            
            if (diffDays >= 2) {
                mcStreak = 0;
                localStorage.setItem('mc_streak', 0);
            }
        }
        updateMcStats();
    }

    function saveStreak() {
        let lastPlayed = localStorage.getItem('mc_lastPlayed');
        let today = new Date();
        let todayStr = today.toISOString();
        
        if (!lastPlayed) {
            mcStreak++;
            localStorage.setItem('mc_lastPlayed', todayStr);
        } else {
            let lastDate = new Date(lastPlayed);
            lastDate.setHours(0,0,0,0);
            let todayMidnight = new Date();
            todayMidnight.setHours(0,0,0,0);
            
            if (todayMidnight > lastDate) {
                mcStreak++;
                localStorage.setItem('mc_lastPlayed', todayStr);
            }
        }
        localStorage.setItem('mc_streak', mcStreak);
        updateMcStats();
    }

    function updateMcStats() {
        mcStreakBadge.textContent = `🔥 Seri: ${mcStreak}`;
        mcScoreBadge.textContent = `🏆 Puan: ${mcScore}`;
    }

    function nextMathcatQuestion() {
        const selectedGrade = parseInt(gradeSelect.value);
        const selectedTopic = topicSelect.value;
        const selectedLevel = levelSelect.value;

        const qData = generateMathcatQuestion(selectedGrade, selectedTopic, selectedLevel);
        
        // Remove and re-add bubble to trigger animation
        const bubble = document.getElementById('mc-bubble');
        bubble.style.animation = 'none';
        bubble.offsetHeight; /* trigger reflow */
        bubble.style.animation = null;

        mcQuestionText.innerHTML = qData.text;
        mcCorrectAnswer = qData.answer;
        
        mcAnswerInput.value = '';
        if (mcConsecutiveCorrect === 0) {
            mcFeedbackText.textContent = 'Oyuna başlamak için bir işlem çöz!';
            mcCat.style.transform = 'none';
        }
        mcFeedbackText.className = 'feedback-msg';
        
        // Hide mouse initially for new question
        mcMouse.style.opacity = '0';
        mcMouse.style.transform = 'none';
        
        mcAnswerInput.focus();
    }

    // MEB Müfredatına Uygun Soru Üretici (2., 3., 4. ve 5. Sınıflar)
    function generateMathcatQuestion(grade, topic, level) {
        let text = "";
        let ans = 0;
        let num1, num2;
        
        let levelMult = level === "Kolay" ? 1 : (level === "Orta" ? 3 : 10);

        if (topic === "Toplama") {
            if (grade === 2) {
                num1 = Math.floor(Math.random() * (20 * levelMult)) + 10;
                num2 = Math.floor(Math.random() * (20 * levelMult)) + 10;
            } else if (grade === 3) {
                num1 = Math.floor(Math.random() * (100 * levelMult)) + 50;
                num2 = Math.floor(Math.random() * (100 * levelMult)) + 50;
            } else if (grade === 4) {
                num1 = Math.floor(Math.random() * (500 * levelMult)) + 100;
                num2 = Math.floor(Math.random() * (500 * levelMult)) + 100;
            } else { // 5. Sınıf
                num1 = Math.floor(Math.random() * (1000 * levelMult)) + 500;
                num2 = Math.floor(Math.random() * (1000 * levelMult)) + 500;
            }
            ans = num1 + num2;
            text = `${num1} + ${num2} = ?`;
        } else if (topic === "Çıkarma") {
            if (grade === 2) {
                num1 = Math.floor(Math.random() * (40 * levelMult)) + 30;
                num2 = Math.floor(Math.random() * (15 * levelMult)) + 10;
            } else if (grade === 3) {
                num1 = Math.floor(Math.random() * (200 * levelMult)) + 100;
                num2 = Math.floor(Math.random() * (80 * levelMult)) + 20;
            } else if (grade === 4) {
                num1 = Math.floor(Math.random() * (1000 * levelMult)) + 500;
                num2 = Math.floor(Math.random() * (400 * levelMult)) + 100;
            } else { // 5. Sınıf
                num1 = Math.floor(Math.random() * (2000 * levelMult)) + 1000;
                num2 = Math.floor(Math.random() * (900 * levelMult)) + 100;
            }
            if (num2 > num1) { let temp = num1; num1 = num2; num2 = temp; }
            ans = num1 - num2;
            text = `${num1} - ${num2} = ?`;
        } else if (topic === "Çarpma") {
            if (grade === 2) {
                num1 = Math.floor(Math.random() * 5) + 1; // 1-5 çarpım tablosu
                num2 = Math.floor(Math.random() * 9) + 1;
                if (level !== "Kolay") { num1 += 5; num2 += 5; }
            } else if (grade === 3) {
                num1 = Math.floor(Math.random() * 9) + 2;
                num2 = Math.floor(Math.random() * 9) + 2;
                if (level === "Zor") { num1 += 10; }
            } else if (grade === 4) {
                num1 = Math.floor(Math.random() * 40) + 10;
                num2 = Math.floor(Math.random() * 8) + 2;
                if (level === "Zor") { num2 += 10; }
            } else { // 5. Sınıf
                num1 = Math.floor(Math.random() * 90) + 10;
                num2 = Math.floor(Math.random() * 20) + 2;
                if (level === "Zor") { num1 += 100; }
            }
            ans = num1 * num2;
            text = `${num1} x ${num2} = ?`;
        } else if (topic === "Bölme") {
            if (grade === 2) {
                num2 = Math.floor(Math.random() * 5) + 1;
                ans = Math.floor(Math.random() * 5) + 1;
            } else if (grade === 3) {
                num2 = Math.floor(Math.random() * 8) + 2;
                ans = Math.floor(Math.random() * 9) + 2;
            } else if (grade === 4) {
                num2 = Math.floor(Math.random() * 8) + 2;
                ans = Math.floor(Math.random() * 20) + 10;
                if (level === "Zor") { num2 += 10; }
            } else { // 5. Sınıf
                num2 = Math.floor(Math.random() * 20) + 2;
                ans = Math.floor(Math.random() * 40) + 10;
                if (level === "Zor") { ans += 50; }
            }
            num1 = num2 * ans;
            text = `${num1} ÷ ${num2} = ?`;
        }
        return { text, answer: ans };
    }

    mcCheckBtn.addEventListener('click', checkMathcatAnswer);
    mcAnswerInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkMathcatAnswer(); });

    function checkMathcatAnswer() {
        const userAns = mcAnswerInput.value.trim().replace(',', '.');
        if (userAns === '') return;

        if (userAns == mcCorrectAnswer) {
            mcConsecutiveCorrect++;
            mcScore += 10;
            
            if (mcConsecutiveCorrect >= 5) {
                mcFeedbackText.textContent = "HARİKA! Fareyi YAKALADIN! 🐱⚡🐭 Günlük seriyi tamamladın!";
                mcFeedbackText.className = 'feedback-msg success';
                saveStreak(); 
                
                mcMouse.style.opacity = '0';
                mcMouse.style.transform = 'translateY(-110px) translateX(20px) scale(0)';
                // Mobile check for cat translation
                const catMove = window.innerWidth <= 600 ? 120 : 220;
                mcCat.style.transform = `translateX(-${catMove}px) scale(1.2)`;
                
                setTimeout(() => {
                    mcConsecutiveCorrect = 0; 
                    nextMathcatQuestion();
                }, 4000);
            } else {
                mcFeedbackText.textContent = `Doğru! Kedi yaklaşıyor... (${mcConsecutiveCorrect}/5)`;
                mcFeedbackText.className = 'feedback-msg success';
                
                mcMouse.style.opacity = '1';
                mcMouse.style.transform = 'translateY(-110px) translateX(20px)';
                const stepMove = window.innerWidth <= 600 ? 25 : 44;
                mcCat.style.transform = `translateX(-${mcConsecutiveCorrect * stepMove}px) scale(1.05)`;
                
                setTimeout(() => {
                    nextMathcatQuestion();
                }, 2000);
            }
        } else {
            mcConsecutiveCorrect = 0; 
            mcFeedbackText.textContent = "Yanlış cevap! Fare kaçtı, kedi başa döndü! (0/5)";
            mcFeedbackText.className = 'feedback-msg error';
            
            mcCat.style.transform = 'none';
            mcMouse.style.opacity = '0';
            mcMouse.style.transform = 'none';
            
            mcAnswerInput.style.transform = 'translateX(10px)';
            setTimeout(() => mcAnswerInput.style.transform = 'translateX(-10px)', 100);
            setTimeout(() => mcAnswerInput.style.transform = 'translateX(10px)', 200);
            setTimeout(() => mcAnswerInput.style.transform = 'translateX(0)', 300);
        }
        updateMcStats();
    }
});
