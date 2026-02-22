// ==================== GLOBAL VARIABLES ====================

let secretNumber;
let attempts;
let guessHistory;
let bestScore;
let gamesPlayed;

// ==================== INITIALIZATION ====================
$(document).ready(function() {
    loadGameData();
    initializeGame();
    setupEventListeners();
});

// ==================== GAME FUNCTIONS ====================

function initializeGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    sessionStorage.setItem('secretNumber', secretNumber);
    attempts = 0;
    guessHistory = [];
    updateDisplay();
    $('#guessInput').val('').focus();
    $('#guessInput').prop('disabled', false);
    $('#submitGuess').prop('disabled', false);
    showMessage('Make your first guess!', 'info');
}

function checkGuess() {
    const guess = parseInt($('#guessInput').val());
    
    if (isNaN(guess)) {
        showMessage('Please enter a valid number!', 'error');
        return;
    }
    
    if (guess < 1 || guess > 100) {
        showMessage('Number must be between 1 and 100!', 'warning');
        return;
    }
    
    if (guessHistory.includes(guess)) {
        showMessage('You already guessed ' + guess + '!', 'warning');
        return;
    }
    
    attempts++;
    guessHistory.push(guess);
    
    if (guess === secretNumber) {
        handleWin();
    } else if (guess < secretNumber) {
        showMessage('📉 Too low! Try higher.', 'warning');
    } else {
        showMessage('📈 Too high! Try lower.', 'warning');
    }
    
    updateDisplay();
    $('#guessInput').val('').focus();
}

function handleWin() {
    showMessage('🎉 You won in ' + attempts + ' attempts!', 'success');
    gamesPlayed++;
    
    if (bestScore === null || attempts < bestScore) {
        bestScore = attempts;
    }
    
    saveGameData();
    updateDisplay();
    $('#guessInput').prop('disabled', true);
    $('#submitGuess').prop('disabled', true);
}

// ==================== SESSION STORAGE ====================

function saveGameData() {
    sessionStorage.setItem('bestScore', bestScore);
    sessionStorage.setItem('gamesPlayed', gamesPlayed);
    localStorage.setItem('bestScore', bestScore);
    localStorage.setItem('gamesPlayed', gamesPlayed);
}

function loadGameData() {
    bestScore = localStorage.getItem('bestScore');
    gamesPlayed = localStorage.getItem('gamesPlayed');
    bestScore = bestScore ? parseInt(bestScore) : null;
    gamesPlayed = gamesPlayed ? parseInt(gamesPlayed) : 0;
}

function clearStatistics() {
    if (confirm('Clear all statistics?')) {
        sessionStorage.clear();
        localStorage.clear();
        bestScore = null;
        gamesPlayed = 0;
        attempts = 0;
        guessHistory = [];
        secretNumber = null;
        updateDisplay();
        showMessage('Statistics cleared!', 'info');
    }
}

// ==================== DISPLAY FUNCTIONS ====================

function updateDisplay() {
    $('#attempts').text(attempts);
    $('#bestScore').text(bestScore !== null ? bestScore : '-');
    $('#gamesPlayed').text(gamesPlayed);
    displayGuessHistory();
}

function displayGuessHistory() {
    if (guessHistory.length === 0) {
        $('#historyList').text('None yet');
        return;
    }
    
    let historyHTML = '';
    for (let i = 0; i < guessHistory.length; i++) {
        historyHTML += '<span class="guess-item">' + guessHistory[i] + '</span>';
    }
    $('#historyList').html(historyHTML);
}

function showMessage(text, type) {
    const $message = $('#message');
    $message.removeClass('success error info warning');
    $message.addClass(type).text(text);
}

// ==================== STORAGE MANAGEMENT ====================

function addToLocalStorage() {
    const gameData = {
        bestScore: bestScore,
        gamesPlayed: gamesPlayed,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('gameData', JSON.stringify(gameData));
    showMessage('✅ Data saved to LocalStorage!', 'success');
}

function deleteLocalStorage() {
    localStorage.removeItem('gameData');
    showMessage('🗑️ LocalStorage deleted!', 'info');
}

function addCookie() {
    const gameData = JSON.stringify({
        bestScore: bestScore,
        gamesPlayed: gamesPlayed
    });
    document.cookie = 'gameData=' + encodeURIComponent(gameData) + '; path=/';
    showMessage('✅ Data saved to Cookie!', 'success');
}

function deleteCookie() {
    document.cookie = 'gameData=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    showMessage('🗑️ Cookie deleted!', 'info');
}

function addSessionStorage() {
    const gameData = {
        bestScore: bestScore,
        gamesPlayed: gamesPlayed,
        secretNumber: secretNumber,
        sessionStart: new Date().toISOString()
    };
    sessionStorage.setItem('gameData', JSON.stringify(gameData));
    showMessage('✅ Data saved to SessionStorage!', 'success');
}

function deleteSessionStorage() {
    sessionStorage.removeItem('gameData');
    showMessage('🗑️ SessionStorage deleted!', 'info');
}

// ==================== EVENT HANDLERS ====================

function setupEventListeners() {
    $('#submitGuess').click(function() {
        checkGuess();
    });
    
    $('#guessInput').keypress(function(event) {
        if (event.which === 13) {
            checkGuess();
        }
    });
    
    $('#resetGame').click(function() {
        initializeGame();
    });
    
    $('#clearStats').click(function() {
        clearStatistics();
    });
    
    // LocalStorage buttons
    $('#local_storage').click(function() {
        addToLocalStorage();
    });
    
    $('#delete_local_storage').click(function() {
        deleteLocalStorage();
    });
    
    // Cookie buttons
    $('#addCookie').click(function() {
        addCookie();
    });
    
    $('#delete_addCookie').click(function() {
        deleteCookie();
    });
    
    // Session Storage buttons
    $('#addSession').click(function() {
        addSessionStorage();
    });
    
    $('#delete_addSession').click(function() {
        deleteSessionStorage();
    });
}
