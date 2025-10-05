// script.js
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${d.toUTCString()};path=/`;
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
}

function updateProgressDisplay(val) {
  const spans = document.querySelectorAll('#valeurCookie');
  spans.forEach(s => s.textContent = val);
}

document.addEventListener('DOMContentLoaded', () => {
  const COOKIE_NAME = 'progression';
  const raw = getCookie(COOKIE_NAME);
  let progress = raw !== null ? parseInt(raw, 10) : NaN;
  if (!Number.isInteger(progress) || progress < 1) progress = 1;
  setCookie(COOKIE_NAME, progress, 7);
  updateProgressDisplay(progress);

  const page = document.body.id || '';
  const resultEl = document.getElementById('result');
  const continueBtn = document.getElementById('continueBtn');
  const resetBtn = document.getElementById('resetBtn');

  // Réinitialiser la progression depuis toutes les pages
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      progress = 1;
      setCookie(COOKIE_NAME, progress, 7);
      updateProgressDisplay(progress);
      if (resultEl) {
        resultEl.textContent = 'Progression réinitialisée.';
        resultEl.style.color = 'black';
      }
      if (continueBtn) continueBtn.style.display = 'none';
    });
  }

  // Page d’accueil (index)
  if (page === 'page-index') {
    const link2 = document.getElementById('link-enigme2');
    if (link2) {
      if (progress < 2) {
        link2.classList.add('disabled');
        link2.removeAttribute('href');
      } else {
        // rendre cliquable si progression suffisante (assure que href existe)
        if (!link2.getAttribute('href')) link2.setAttribute('href', 'enigme 2.html');
        link2.classList.remove('disabled');
      }
    }
  }

  // Énigme 1
  if (page === 'page-enigme1') {
    // Si l'utilisateur n'a pas la progression requise, renvoyer vers index
    if (progress < 1) {
      location.href = 'enigme 1.html';
      return;
    }

    const checkBtn = document.getElementById('checkBtn');
    const userAnswer = document.getElementById('userAnswer');

    if (checkBtn && userAnswer && resultEl) {
      checkBtn.addEventListener('click', () => {
        const answer = userAnswer.value.trim().toLowerCase();
        if (answer === 'mort' && progress === 1) {
          progress = 2;
          setCookie(COOKIE_NAME, progress, 7);
          updateProgressDisplay(progress);
          resultEl.innerHTML = "<em>Bonne réponse ! Le 29 février 1952 n'existe pas.</em>";
          resultEl.style.color = 'green';
          if (continueBtn) {
            continueBtn.style.display = 'inline-block';
            continueBtn.textContent = 'Continuer vers énigme 2';
            continueBtn.onclick = () => { location.href = 'enigme 2.html'; };
          }
        } else {
          resultEl.innerHTML = "<em>Mauvaise réponse, essaie encore.</em>";
          resultEl.style.color = 'red';
        }
      });
    }

    // Si l'utilisateur a déjà progressé au-delà, afficher bouton continuer
    if (continueBtn && progress >= 2) {
      continueBtn.style.display = 'inline-block';
      continueBtn.textContent = 'Continuer vers énigme 2';
      continueBtn.onclick = () => { location.href = 'enigme 2.html'; };
    }
  }

  // Énigme 2
  if (page === 'page-enigme2') {
    if (progress < 2) {
      location.href = 'enigme 2.html';
      return;
    }

    const form = document.getElementById('choiceForm');

    if (form && resultEl) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const choix = document.querySelector('input[name="poisonChoice"]:checked');
        if (!choix) {
          resultEl.innerHTML = "<em>Choisis une option.</em>";
          resultEl.style.color = 'red';
          return;
        }
        if (choix.value === 'curare' && progress === 2) {
          progress = 3;
          setCookie(COOKIE_NAME, progress, 7);
          updateProgressDisplay(progress);
          resultEl.innerHTML = "<em>Bonne réponse ! La tasse contenait suffisamment de Curare pancuronium pour le tuer.</em>";
          resultEl.style.color = 'green';
          if (continueBtn) {
            continueBtn.style.display = 'inline-block';
            continueBtn.textContent = 'Terminer';
            continueBtn.onclick = () => {
              alert('Bravo, tu as fini toutes les énigmes !');
              location.href = 'index.html';
            };
          }
        } else {
          resultEl.innerHTML = "<em>Mauvaise réponse, essaie encore.</em>";
          resultEl.style.color = 'red';
        }
      });
    }

    // si déjà terminé
    if (continueBtn && progress >= 3) {
      continueBtn.style.display = 'inline-block';
      continueBtn.textContent = 'Terminer';
      continueBtn.onclick = () => {
        alert('Bravo, tu as fini toutes les énigmes !');
        location.href = 'index.html';
      };
    }
  }
});

