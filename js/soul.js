// js/soul.js  測試版

import { mountStarfield } from './shared.js';

const s = {};

const TEST_QUESTIONS = [
  '測試題目 1｜如果今天宇宙給你一個小小奇蹟，你希望是什麼？',
  '測試題目 2｜最近一次讓你感到「有被看見」的是什麼瞬間？',
  '測試題目 3｜如果要用一個詞形容現在的自己，你會選什麼？'
];

function renderQuestions() {
  console.log('renderQuestions 執行中，題目數：', TEST_QUESTIONS.length);

  if (!s.qGrid) return;
  s.qGrid.innerHTML = '';

  TEST_QUESTIONS.forEach(raw => {
    const [q, tw] = raw.split('｜');
    const opt = document.createElement('div');
    opt.className = 'option';
    opt.innerHTML = `
      <span class="q">${q}</span>
      <span class="tw">${tw || ''}</span>
    `;
    s.qGrid.appendChild(opt);
  });
}

function init() {
  console.log('SOUL.JS 測試版載入');

  mountStarfield('starfield', { density: 150, hue: 265 });

  s.qGrid = document.querySelector('.question-grid');
  if (!s.qGrid) {
    console.log('找不到 .question-grid');
    return;
  }

  renderQuestions();
}

document.addEventListener('DOMContentLoaded', init);
