/* AskGPT funnel prototype — Google → loading → streaming chat → gate → register → paywall */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const params = new URLSearchParams(location.search);

  const COPY = {
    user: 'Which AI model is best for vibe coding iOS apps?',
    answer: [
      'It depends on whether you want to touch code or not — the tools split into two camps.',
      'If you can read Swift and have Xcode: Claude Code or Cursor with Claude / GPT-5 gives you the most control. You describe the screen, it writes SwiftUI, you run it in the simulator and iterate.',
      'If you don’t want to see code at all: Lovable, Base44 or Rork generate a working app from a prompt — fast to start, but you’ll hit walls on native APIs (camera, push, in-app purchase). For a first app, Claude Code plus Xcode is the safest bet; for a quick demo, Rork Max.'
    ]
  };
  COPY.followups = {
    'Compare Claude Code vs Cursor': [
      'Both give you a real Xcode project you own — the difference is how you steer.',
      'Cursor is an editor: you see every file, accept diffs line by line and keep full control. Claude Code is an agent in the terminal: you describe the feature, it edits several files, runs the build and reports back.',
      'For a first iOS app most people start in Cursor to learn the codebase, then hand repetitive work to Claude Code. Both need Xcode installed and an Apple developer account to ship.'
    ],
    'Write my first SwiftUI prompt': [
      'Here is a prompt you can paste as-is:',
      '“Create a SwiftUI app with one screen called TodayView. Show a list of tasks with a checkbox, a text field to add a task, and a header with today’s date. Use @State for the list, keep everything in one file, and target iOS 17.”',
      'Run it, then iterate one change at a time — add persistence with SwiftData, then a detail screen, then haptics. Small steps keep the generated code readable.'
    ],
    'Which model is cheapest to start?': [
      'Free tiers cover a surprising amount of a first app.',
      'Claude and GPT-5 both have free plans with daily limits that are fine for prototyping; Gemini’s free tier is the most generous for long files. Cursor is $20/month after a two-week trial, Claude Code needs a paid Claude plan.',
      'Cheapest path: draft in a free chat, paste into Xcode yourself, and only pay for an agent once you are iterating daily.'
    ]
  };
  const LOADING_MS = 2000;               // "Animation lasts 2 sec"
  const TYPE_MS = reduce ? 0 : 14;       // per character

  const app = $('#app'), thread = $('#thread'), loading = $('#loading'); let answer = $('#answer');
  let currentCopy = COPY.answer;
  const userMsg = $('#userMsg'), gateCta = $('#gateCta'), prompts = $('#prompts'), composerInput = $('#composerInput');
  const bar = $('#protoStep'), toast = $('#toast');
  let step = 1, run = 0, phase = 'idle';

  /* ---------- helpers */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  function showToast(msg) { toast.textContent = msg; toast.classList.add('is-in'); clearTimeout(showToast.t); showToast.t = setTimeout(() => toast.classList.remove('is-in'), 2600); }
  function setStep(n) { step = n; bar.textContent = 'Step ' + n + ' / 6'; params.set('step', n); history.replaceState(null, '', '?' + params.toString()); }
  function openModal(id) { const m = $('#' + id); m.dataset.open = 'true'; document.body.style.overflow = 'hidden'; const f = $('[data-modal-close]', m); if (f) f.focus({ preventScroll: true }); }
  function closeModal(id) { $$('.modal').forEach((m) => { if (!id || m.id === id) m.dataset.open = 'false'; }); document.body.style.overflow = ''; }
  function activate(name) { $$('.step').forEach((s) => s.classList.toggle('is-active', s.dataset.step === name)); }
  function scrollThread() { const sc = $('.chat__scroll', app); if (sc) sc.scrollTop = sc.scrollHeight; }

  const ROWS = 3;                        // "only 3 rows appear, then the text is covered"
  const lineHeight = () => parseFloat(getComputedStyle($$('p', answer)[0]).lineHeight) || 26;
  const rowsTyped = () => { const lh = lineHeight(); return $$('p', answer).reduce((n, p) => n + (p.textContent ? Math.round(p.offsetHeight / lh) : 0), 0); };
  /* Height of the first ROWS rendered rows, measured on the filled-in answer */
  function gateHeight() {
    const lh = lineHeight(); let acc = 0;
    for (const p of $$('p', answer)) { const r = Math.round(p.offsetHeight / lh); if (acc + r >= ROWS) return (p.offsetTop - answer.offsetTop) + (ROWS - acc) * lh; acc += r; }
    return answer.offsetHeight;
  }
  function fillAnswer() { $$('p', answer).forEach((p, i) => { p.textContent = currentCopy[i] || ''; p.classList.add('is-in'); p.classList.remove('is-typing'); }); }
  /* Appends a new user turn + empty answer and makes it the current one */
  function createTurn(userText, copy) {
    const u = document.createElement('div'); u.className = 'message message--user'; u.innerHTML = '<div class="message__bubble"></div>'; u.firstChild.textContent = userText;
    const a = document.createElement('div'); a.className = 'message message--assistant answer'; a.innerHTML = '<p></p><p></p><p></p>';
    thread.insertBefore(u, gateCta); thread.insertBefore(a, gateCta);
    answer = a; currentCopy = copy; return a;
  }
  function resetTurns() { $$('.message', thread).forEach((m, i) => { if (i > 1) m.remove(); }); answer = $('#answer'); currentCopy = COPY.answer; answer.classList.remove('is-gated'); answer.style.removeProperty('--gate-h'); }
  async function typeAnswer(token) {
    const ps = $$('p', answer);
    for (let i = 0; i < currentCopy.length; i++) {          // typing mimics AI chat until three rows are on screen
      const r = await typeInto(ps[i], currentCopy[i], token, () => rowsTyped() >= ROWS); if (token !== run) return false;
      if (r === 'stop') break;
      await sleep(reduce ? 60 : 380);
    }
    await sleep(reduce ? 0 : 500); return token === run;
  }

  async function typeInto(el, text, token, shouldStop) {
    el.classList.add('is-in', 'is-typing');
    if (TYPE_MS === 0) { el.textContent = text; el.classList.remove('is-typing'); return shouldStop && shouldStop() ? 'stop' : 'done'; }
    el.textContent = '';
    for (let i = 0; i < text.length; i++) {
      if (token !== run) return 'cancel';
      el.textContent += text[i];
      if (shouldStop && shouldStop()) return 'stop';
      const ch = text[i];
      await sleep(/[.!?]/.test(ch) ? 160 : /[,;:—]/.test(ch) ? 70 : TYPE_MS + (Math.random() * 10 - 5));
      if (i % 12 === 0) scrollThread();
    }
    el.classList.remove('is-typing');
    return 'done';
  }

  /* ---------- steps */
  function goGoogle() { run++; phase = 'idle'; closeModal(); activate('google'); app.dataset.phase = 'idle'; setStep(1); }

  async function goLoading() {
    const token = ++run; phase = 'loading';
    activate('app'); app.classList.add('is-locked'); app.dataset.phase = 'loading';
    loading.hidden = false; thread.hidden = true; gateCta.classList.remove('is-in'); gateCta.hidden = true; prompts.classList.remove('is-in');
    resetTurns(); $$('p', answer).forEach((p) => { p.textContent = ''; p.classList.remove('is-in', 'is-typing'); }); const continued = $('.continued', thread); if (continued) continued.hidden = false;
    const barEl = $('.loading__bar i', loading); barEl.style.animation = 'none'; void barEl.offsetWidth; barEl.style.animation = '';
    setStep(2);
    await sleep(reduce ? 300 : LOADING_MS);
    if (token !== run) return; goChat();
  }

  async function goChat() {
    const token = ++run; phase = 'typing';
    activate('app'); app.classList.remove('is-locked'); app.dataset.phase = 'typing';
    loading.hidden = true; thread.hidden = false; setStep(3);
    userMsg.textContent = ''; await sleep(250); if (token !== run) return;
    userMsg.textContent = COPY.user;                       // the ad headline becomes the first message
    await sleep(reduce ? 100 : 700); if (token !== run) return;
    if (!(await typeAnswer(token))) return;
    goGate();
  }

  function goGate() {
    run++; phase = 'gated'; app.dataset.phase = 'gated';
    activate('app'); loading.hidden = true; thread.hidden = false;
    if (!userMsg.textContent) userMsg.textContent = COPY.user;
    answer.classList.remove('is-gated'); fillAnswer();      // the rest of the text is filled in…
    thread.insertBefore(gateCta, answer.nextSibling);       // CTA always sits under the latest answer
    answer.style.setProperty('--gate-h', gateHeight() + 'px');
    answer.classList.add('is-gated');                       // …and covered by the overlay + CTA after the third row
    gateCta.hidden = false; setTimeout(() => { gateCta.classList.add('is-in'); prompts.classList.add('is-in'); scrollThread(); }, 30);
    setStep(4);
  }

  function goRegister() { activate('app'); if (phase !== 'gated') goGate(); openModal('auth'); setStep(5); }
  /* A prompt chip behaves like the first question: new turn, typing, then the lock again */
  async function askFollowup(text) {
    const copy = COPY.followups[text] || COPY.answer;
    const token = ++run; phase = 'typing'; app.dataset.phase = 'typing';
    gateCta.classList.remove('is-in'); gateCta.hidden = true; composerInput.value = ''; composerInput.dispatchEvent(new Event('input'));
    resetTurns(); currentCopy = copy;                        // start from scratch: the new question replaces the previous answer
    $$('p', answer).forEach((p) => { p.textContent = ''; p.classList.remove('is-in', 'is-typing'); });
    const continued = $('.continued', thread); if (continued) continued.hidden = true;
    userMsg.textContent = text; scrollThread();
    await sleep(reduce ? 100 : 600); if (token !== run) return;
    if (!(await typeAnswer(token))) return;
    goGate();
  }
  function goPaywall() { closeModal('auth'); openModal('paywall'); setStep(6); }

  /* ---------- wiring */
  document.addEventListener('click', (e) => {
    const t = e.target.closest ? e.target : null; if (!t) return;
    const hit = (sel) => t.closest(sel);
    if (hit('a[href="#"]')) e.preventDefault();          // never navigate on placeholder links (matters under a <base href>)
    if (hit('[data-go="google"]')) return goGoogle();
    if (hit('[data-go="loading"]')) return goLoading();
    if (hit('[data-go="register"]')) { e.preventDefault(); return goRegister(); }
    if (hit('[data-go="paywall"]')) { e.preventDefault(); return goPaywall(); }
    if (hit('[data-modal-close]')) { const m = hit('.modal'); closeModal(m && m.id); setStep(4); return; }
    if (hit('[data-theme-toggle]')) { const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light'; document.documentElement.dataset.theme = next; params.set('theme', next); history.replaceState(null, '', '?' + params.toString()); return; }
    if (hit('[data-pay]')) { showToast('End of prototype — payment would start here'); return; }
    if (hit('[data-sidebar-toggle]')) { app.dataset.drawer = app.dataset.drawer === 'open' ? 'closed' : 'open'; return; }
    if (hit('[data-sidebar-close]')) { app.dataset.drawer = 'closed'; return; }
    if (hit('.modal') && !hit('.modal__dialog')) { closeModal(); setStep(4); return; }
    /* Gated screen: every element calls the register popup; prompts stay clickable */
    if (phase === 'gated' && hit('.step--app') && !hit('.modal')) {
      const prompt = hit('[data-prompt]');
      e.preventDefault();
      if (prompt) return askFollowup(prompt.dataset.prompt);   // prompts stay clickable: same behaviour as the first question
      return goRegister();
    }
    if (phase === 'typing' && hit('[data-prompt]')) { e.preventDefault(); return; }
  });
  document.addEventListener('submit', (e) => { e.preventDefault(); if (phase === 'gated') { const v = composerInput.value.trim(); if (v) return askFollowup(v); goRegister(); } });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); if (step >= 5) setStep(4); } });
  composerInput.addEventListener('input', () => { $('#sendBtn').disabled = !composerInput.value.trim(); });

  window.addEventListener('resize', () => { if (answer.classList.contains('is-gated')) { answer.classList.remove('is-gated'); answer.style.setProperty('--gate-h', gateHeight() + 'px'); answer.classList.add('is-gated'); } });

  /* ---------- start */
  const start = parseInt(params.get('step') || '1', 10);
  ({ 1: goGoogle, 2: goLoading, 3: goChat, 4: goGate, 5: goRegister, 6: () => { goGate(); openModal('paywall'); setStep(6); } }[Math.min(6, Math.max(1, start))])();
})();
