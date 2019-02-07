const status = document.getElementById('status');
const account = document.getElementById('account');
const button = document.getElementById('open-popup');

const ws = new WebSocket('ws://localhost:3000');

function setStatus(value) {
  status.innerHTML = value;

  if (value === 'online') {
    status.parentNode.classList.add('is-online');
  } else {
    status.parentNode.classList.add('is-disconnect');
  }
}

function updateValue(value) {
  account.innerHTML = value;
}

ws.onopen = function() {
  setStatus('online');
  changeNoticationText('You are online');
}

ws.onclose = function() {
  setStatus('disconnected');
  changeNoticationText('You are disconnected');
}

ws.onmessage = function(response) {
  updateValue(response.data);

  changeNoticationText('Your amount was updated! - $ ' + response.data);

  setTimeout(()=> {
    button.classList.add('is-show');
  }, 5000);
}



// copy value
const copy = document.getElementById('copy');
const copyBtn = document.getElementById('copy-btn');

copyBtn.addEventListener('click', function() {
  copy.select();
  document.execCommand('copy');
});


// modal window
const modal = document.getElementById('popup');
const btn = document.getElementById('open-popup');
const span = document.getElementsByClassName('popup-close')[0];

btn.onclick = function() {
  getJson();
  modal.style.display = 'block';
  document.body.classList.add('is-overflow');
}

span.onclick = function() {
  hiddenModal();
}

window.onclick = function(event) {
  if (event.target == modal) {
    hiddenModal();
  }
}

function hiddenModal() {
  modal.style.display = 'none';
  document.body.classList.remove('is-overflow');
}

// notification
const notification = document.getElementsByClassName('notification')[0];

function toggleNotification() {
  notification.classList.add('is-show');
  setTimeout(()=> {
    notification.classList.remove('is-show');
  }, 1500);
}

function changeNoticationText(text) {
  toggleNotification();
  notification.childNodes[1].innerHTML = text;
}


// get json
const select = document.getElementById('payments');
const url = 'https://api.myjson.com/bins/1fu9x4';
let data = {};
const spinner = document.getElementById('spinner');

function getJson() {
  let loading = true;

  axios.get(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    }).then(function (response) {
      if (data.length !== response.data.length && loading) {
        loading = false;
        spinner.classList.add('is-hidden');
        data = JSON.parse(JSON.stringify(response.data));

        data.forEach((item) => {
          let opt = document.createElement('option');
          opt.value = item.name;
          opt.innerHTML = item.name;
          select.appendChild(opt);
        });
      }
    }).catch(function (error) {
      // handle error
      console.log(error);
    });
}


// select onChange
let strUser;
const infoLine = document.getElementsByClassName('js-line-hidden')[0];
select.onchange = (e) => {
  strUser = select.options[select.selectedIndex].value;
  infoLine.classList.remove('is-hidden');

  data.forEach((item)=> {
    if (strUser === item.name ) {
      copy.value = item.value;
    }
  });
}
