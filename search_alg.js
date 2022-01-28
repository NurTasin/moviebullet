const search_thresold=75;
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};



particlesJS.load('particles-js', 'modules/particlesjs.config.json', function() {
    console.log('callback - particles.js config loaded');
});


function spawnBuildError(title="Site Building Error!",msg=""){
    console.log(
`${title}!
=====================
${msg}
=====================`)
//   document.write(`<div id="error-box"><div class="face2"><div class="eye"></div><div class="eye right"></div>  <div class="mouth sad"></div></div><div class="shadow move"></div><div class="message"><h1 class="alert">${title}</h1><p>${msg}</div></div></div><style>@import "https://fonts.googleapis.com/css?family=Lato:400,700";/* CSSTidy 1.5.2: Mon, 01 Nov 2021 05:21:47 +0000 */html{display:grid;min-height:100%}body{display:grid;overflow:hidden;font-family:"Lato",sans-serif;text-align:center}#container{position:relative;margin:auto;overflow:hidden;width:700px;height:250px}h1{font-size:1.5em;font-weight:100;padding-top:5px;color:#FCFCFC;padding-bottom:5px}.green{color:#4ec07d}.red{color:#e96075}.alert{font-weight:700}p{margin-top:-5px;font-size:.9em;font-weight:100;color:#5e5e5e}button,.dot{cursor:pointer}#error-box{position:absolute;width:90%;height:100%;left:50%;transform:translateX(-50%);background:linear-gradient(to bottom left,#EF8D9C 40%,#FFC39E 100%);border-radius:20px;box-shadow:5px 5px 20px rgba(203,205,211,0.1)}.face2{position:absolute;width:15vw;height:15vw;background:#FCFCFC;border-radius:50%;border:1px solid #777;top:15%;left:37.5%;z-index:2;animation:roll 3s ease-in-out infinite}.eye{position:absolute;width:5px;height:5px;background:#777;border-radius:50%;top:40%;left:20%}.right{left:68%}.mouth{position:absolute;top:43%;left:41%;width:7px;height:7px;border-radius:50%}.sad{top:49%;border:2px solid;border-color:#777 transparent transparent #777;transform:rotate(45deg)}.move{animation:move 3s ease-in-out infinite}.message{position:absolute;width:100%;text-align:center;height:40%;bottom:0}@keyframes bounce{50%{transform:translateY(-10px)}}@keyframes roll{0%{transform:rotate(0deg);left:25%}50%{left:60%;transform:rotate(168deg)}100%{transform:rotate(0deg);left:25%}}@keyframes move{0%{left:25%}50%{left:60%}100%{left:25%}}</style>`)
}
function reverseObject(object) {
    var newObject = {};
    var keys = [];

    for (var key in object) {
        keys.push(key);
    }

    for (var i = keys.length - 1; i >= 0; i--) {
      var value = object[keys[i]];
      newObject[keys[i]]= value;
    }       

    return newObject;
}
let bulletdb=JSON.parse(localStorage.getItem("bullet_db"))

function RenderLink(name,link){
    return `
    <div class="link-card"><a class="link-wrapper" href="${link}"><h3 class="link">${name}</h3></a></div>
    `;
}

function RenderLinks(text,dictionary){
    let element=`
    <div class="result-wrapper">
    <div class="status">
    <button id="home-btn"><i class="fas fa-arrow-left fa-3x"></i></button>
    <input type="text" value="${text}" id="search-query"  readonly/>
    </div>
    <div id="search_number">
    <p>${Object.keys(dictionary).length} results found.</p>
    </div>
    `;
    if(Object.keys(dictionary).length>0){
        for( movie in dictionary){
            element+=RenderLink(movie,dictionary[movie]);
        }
    }else{
        element+=`<h2 class="no-result"><i class="fas fa-exclamation-triangle fa-2x"></i>         No results found for "${text}". Check your spelling and try again.</h2>`
    }
    
    element+=`</div>`;
    return element;
}

function PlotResults(text,dictionary){
    document.getElementById("result-plot").innerHTML=RenderLinks(text,reverseObject(dictionary));
}
text = localStorage.getItem("search-term")
let results = {};
let highScore = 0;
for (const i in bulletdb) {
    let score = fuzzball.partial_ratio(String(text).toLowerCase(), String(i).toLowerCase());
    if (score > highScore) { highScore = score }
    if (score > search_thresold) {
        results[String(i)] = String(bulletdb[String(i)]);
    }
}
console.log(highScore);
PlotResults(text, results);