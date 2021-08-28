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
        for(const i in bulletdb){
            if (String(i).toLowerCase().includes(text.toLowerCase())){
                results[String(i)]=String(bulletdb[String(i)]);
            }
        }
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
    `;
    if(Object.keys(dictionary).length>0){
        for( movie in dictionary){
            element+=RenderLink(movie,dictionary[movie]);
        }
    }else{
        element+=`<h2 class="no-result"><i class="fas fa-exclamation-triangle fa-2x"></i>         No Result Found. Check your spelling and try again.</h2>`
    }
    
    element+=`</div>`;
    return element;
}

function PlotResults(text,dictionary){
    document.getElementById("result-plot").innerHTML=RenderLinks(text,dictionary);
    document.getElementById("search-page").style.display="none";
    document.getElementById("icon-wrapper").style.display="none";
    document.getElementById("home-btn").addEventListener("click",(ev)=>{
        location.reload();
    })
}