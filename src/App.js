import React from 'react'
import logo from './loading.gif'

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function App() {
  var GetIdByNicknameURL = 'https://glacial-woodland-89247.herokuapp.com/by-nickname/'
  var profileDataURL = 'https://glacial-woodland-89247.herokuapp.com/profiles/'

  let currentID
  let currentName

  function change_window(n) {
      document.getElementById('startpageroot').style.display = 'none'
      document.getElementById('profile_root').style.display = 'none'
      document.getElementById('loading_root').style.display = 'none'

      document.getElementById(n).style.display = 'block'
  }

  function formatUNIXTime(unixtimestamp) {
    var date = new Date(unixtimestamp);
    var year = date.getFullYear();
    var month = date.getMonth()+1
    var day = date.getDate();
    var convdataTime = month+'/'+day+'/'+ year.toString().slice(2)
    
    return convdataTime
  }
  /*
  userID: String,
	banned: Boolean,
	inGame: Boolean,
	firstJoined: Number,
	lastJoined: Number,
	history: Array
  */
  function show_profile(name, id, data) {
    change_window('profile_root')
    currentID = id
    currentName = name
    document.getElementById('firstjoined').innerHTML = formatUNIXTime(data.firstJoined*1000)
    document.getElementById('lastjoined').innerHTML = formatUNIXTime(data.lastJoined*1000)
    document.getElementById('banned').innerHTML = data.banned && 'Да' || 'Нет'
    document.getElementById('ingame').innerHTML = data.inGame && 'Да' || 'Нет'
    document.getElementById('name').innerHTML = name
    document.getElementById('id').innerHTML = id

    var range = document.createRange();
    range.selectNodeContents(document.getElementById('historyContent'));
    range.deleteContents();

    for (let dictInfo of data.history) {
      let action = dictInfo.action
      let text = ''

      if (action == 'ban') {
        text = `${name}, Бан (${formatUNIXTime(dictInfo.time*1000)})`
      }
      else if (action == 'unban') {
        text = `${name}, Разбан (${formatUNIXTime(dictInfo.time*1000)})`
      }
      else if (action == 'resetStats') {
        text = `${name}, Ресет стат (${formatUNIXTime(dictInfo.time*1000)})`
      }
      var elem = document.createElement('dl')
      elem.className='historyText'
      elem.innerHTML=text
      
      var original = document.getElementById('iddddd')
      var par = document.getElementById('historyContent')
      par.insertBefore(elem, original); 
    }
  }

  function clicked_next(_, n) {
    let name = n || document.getElementById('usernameTextbox').value
    if (name !== '') {

      change_window('loading_root')

      httpGetAsync(GetIdByNicknameURL+name, res => {
        let data = JSON.parse(res)
        if (data.Id && data.Username) {
          let id = data.Id
          let username = data.Username

          httpGetAsync(profileDataURL+id, res => {
            let data = JSON.parse(res)
            if (data.userID !== undefined) {
              show_profile(username, id, data)
            }
            else if (data.success !== undefined) {
              change_window('startpageroot')
              alert('Ошибка.')
            }
          })

        }
        else if (data.success !== undefined) {
          change_window('startpageroot')
          alert('Такого игрока не существует.')
        }
      })
    }
    else {
      document.getElementById('usernameTextbox').value = ''
      alert('Напишите что нибудь.')
    }
    document.getElementById('usernameTextbox').value = ''
  }



  function clicked_banBtn() {
    if (currentID != undefined) {
      var url = 'https://glacial-woodland-89247.herokuapp.com/user-ban/' + currentID
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
              if (xmlHttp.responseText === 'Updated Database.') {
                alert('✅')
                clicked_next(0, currentName)
              }
              else {
                alert('ошибка (код: 2)')
              }
      }
      xmlHttp.open("POST", url, true); // true for asynchronous 
      xmlHttp.send(null);
    }
    else {
      alert('ошибка (код: 1)')
    }
  }
  function clicked_unbanBtn() {
    if (currentID != undefined) {
      var url = 'https://glacial-woodland-89247.herokuapp.com/user-unban/' + currentID
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
              if (xmlHttp.responseText === 'Updated Database.') {
                alert('✅')
                clicked_next(0, currentName)
              }
              else {
                alert('ошибка (код: 2)')
              }
      }
      xmlHttp.open("POST", url, true); // true for asynchronous 
      xmlHttp.send(null);
    }
    else {
      alert('ошибка (код: 1)')
    }
  }
  function clicked_historyBtn() {
   document.getElementById('history_root').style.display = 'block'
  }
  function clicked_restartBtn() {
    clicked_next(0, currentName)
  }
  function clicked_resetStatsBtn() {
    if (currentID != undefined) {
      var url = 'https://glacial-woodland-89247.herokuapp.com/user-stats-reset/' + currentID
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
              if (xmlHttp.responseText === 'Updated Database.') {
                alert('✅')
                clicked_next(0, currentName)
              }
              else {
                alert('ошибка (код: 2)')
              }
      }
      xmlHttp.open("POST", url, true); // true for asynchronous 
      xmlHttp.send(null);
    }
    else {
      alert('ошибка (код: 1)')
    }
  }
  function clicked_resetProfileBtn() {
    if (currentID != undefined) {
      var url = 'https://glacial-woodland-89247.herokuapp.com/user-profile-reset/' + currentID
      var xmlHttp = new XMLHttpRequest();
      xmlHttp.onreadystatechange = function() { 
          if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
              if (xmlHttp.responseText === 'Updated Database.') {
                alert('✅')
                clicked_next(0, currentName)
              }
              else {
                alert('ошибка (код: 2)')
              }
      }
      xmlHttp.open("POST", url, true); // true for asynchronous 
      xmlHttp.send(null);
    }
    else {
      alert('ошибка (код: 1)')
    }
  }
  function clicked_backBtn() {
    change_window('startpageroot')
  }

  function clicked_close_btn() {
    document.getElementById('history_root').style.display = 'none'
  }
  return (<div className='wrapper'>
  <div id='startpageroot'>
  <h1>Админ Панель</h1> 
  <div id='startPage'>
    <h1 id='plrName'>Имя Игрока:</h1>
    <input type='text' id='usernameTextbox'></input>
    <button id='nextBtn' onClick={clicked_next}>Дальше</button>
  </div>
  </div>

  <div id='loading_root'>
  <div id='loadingPage'>
    <img src={logo} alt="loading..." id='loadingImg'/>
    <h1 id='loadingTxt'>Загрузка...</h1>
  </div>
  </div>

  <div id='profile_root'>
  <div id='profilePage'>
    <ul type='none'>
      <li className='profileStatText'>Первый заход: <strong className='statBold' id='firstjoined'>00/00/00</strong></li>
      <li className='profileStatText'>Последний заход: <strong className='statBold' id='lastjoined'>00/00/00</strong></li>
      <li className='profileStatText'>Забанен: <strong className='statBold' id='banned'>?</strong></li>
      <li className='profileStatText'>В игре: <strong className='statBold' id='ingame'>?</strong></li>
      <li className='profileStatText'>Имя: <strong className='statBold' id='name'>user_name</strong></li>
      <li className='profileStatText'>ID: <strong className='statBold' id='id'>user_id</strong></li>
    </ul>
    <div id='profileActions'>
        <button className='profileactbtn' id='banBtn' onClick={clicked_banBtn}>Бан</button>
        <button className='profileactbtn' id='unbanBtn' onClick={clicked_unbanBtn}>Разбан</button>
        <button className='profileactbtn' id='historyBtn' onClick={clicked_historyBtn}>История</button>
        <button className='profileactbtn' id='restartBtn' onClick={clicked_restartBtn}>Обновить</button>
        <button className='profileactbtn' id='resetStatsBtn' onClick={clicked_resetStatsBtn}>Ресет стат</button>
        <button className='profileactbtn' id='resetProfileBtn' onClick={clicked_resetProfileBtn}>Ресет проф.</button>
        <button className='profileactbtn' id='backBtn' onClick={clicked_backBtn}>Назад</button>
    </div>
  </div>
  </div>


  
  <div id='history_root'>
  
  <div id='history_page'>
    <dl id='historyContent'>
      <span id='iddddd'></span>
    </dl>
    <button id='closeBtn' onClick={clicked_close_btn}>Закрыть</button>
  </div>

  </div>
  </div>);
}

export default App;