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

getJSON('https://raw.githubusercontent.com/NurTasin/links/main/movies.json',
function(err, data) {
  if (err !== null) {
    alert('Can\'t fetch the database. Something went wrong!!\n ' + err);
  } else {
    bulletdb=data;
    document.getElementById("searchTxt").placeholder+=` Search among ${Object.keys(bulletdb).length} movies`
  }
});

let bulletdb;

document.getElementById("searchBtn").addEventListener("click",
    (ev)=>{
        __search();
})

document.getElementById("searchTxt").addEventListener('keyup',
    (ev)=>{
        if(ev.keyCode===13){
            __search();
        }
    }
)

document.addEventListener("keyup",
    (ev)=>{
        if(ev.keyCode===9){
            document.getElementById("searchTxt").focus();
        }
    }
)

function __search(){
    text=document.getElementById("searchTxt").value.trim();
    if(text==""){
        alert("Enter the name of your desired movie in the search field and try again.");
        return;
    }else{
        let results={};
        let highScore=0;
        for(const i in bulletdb){
            let score=fuzzball.partial_ratio(String(text).toLowerCase(),String(i).toLowerCase());
            if(score>highScore){highScore=score}
            if (score>search_thresold){
                results[String(i)]=String(bulletdb[String(i)]);
            }
        }
        console.log(highScore);
        PlotResults(text,results);
    }
}

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
    document.getElementById("result-plot").innerHTML=RenderLinks(text,dictionary);
    document.getElementById("search-page").style.display="none";
    document.getElementById("icon-wrapper").style.display="none";
    document.getElementById("background").style.display="none";
    document.getElementById("bgcover").style.display="none";   
    document.body.style.backgroundColor="#eee"; 
    document.getElementById("home-btn").addEventListener("click",(ev)=>{
        location.reload();
    })
}

getJSON("https://api.github.com/repos/NurTasin/links/git/refs/heads/main",(err,data)=>{
    if(err){
        console.error(err);
    }else{
        getJSON(data.object.url,(err,data_)=>{
            if(err){
                console.error(err);
            }else{
                let date__=new Date(data_.committer.date)
                document.getElementById("dbupdatedate").innerText=`${date__.getDate()}/${date__.getMonth()}/${date__.getFullYear()} ${date__.getHours()}:${date__.getMinutes()}:${date__.getSeconds()}` 
            }
        })
    }
})

getJSON("https://api.github.com/repos/NurTasin/movie-bullet-gui/git/refs/heads/main",(err,data)=>{
    if(err){
        console.error(err);
    }else{
        getJSON(data.object.url,(err,data_)=>{
            if(err){
                console.error(err);
            }else{
                let last_date= new Date(data_.committer.date);
                let date__={
                    "day":last_date.getDate(),
                    "month":last_date.getMonth(),
                    "year":last_date.getFullYear(),
                    "hour":last_date.getHours(),
                    "minute":last_date.getMinutes(),
                    "second":last_date.getSeconds()
                }
                console.log(`Site Last Update On : ${date__.day}/${date__.month}/${date__.year} ${date__.hour}:${date__.minute}:${date__.second}`)
            }
        })
    }
})

console.log("Site Version: 2.1.1")