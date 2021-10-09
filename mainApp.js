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

document.body.addEventListener("keydown",
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
    }/*else if(fuzzball.partial_ratio(String(text).toLowerCase().trim(),String("How To Download").toLowerCase())>=90){
        HowTo();
    }*/else{
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


let inPlot=false

function PlotResults(text,dictionary){
    document.getElementById("result-plot").innerHTML=RenderLinks(text,reverseObject(dictionary));
    document.getElementById("search-page").style.display="none";
    document.getElementById("icon-wrapper").style.display="none";
    // document.getElementById("background").style.display="none";
    // document.getElementById("bgcover").style.display="none";
    document.body.style.backgroundColor="#eee"; 
    inPlot=true
    document.getElementById("home-btn").addEventListener("click",(ev)=>{
        // location.reload();
        document.getElementById("result-plot").innerHTML="";
        document.getElementById("search-page").style.display="";
        document.getElementById("icon-wrapper").style.display="";
        inPlot=false
    })
}

document.getElementById("how-to").addEventListener("click",(ev)=>{
    HowTo();
})

function HowTo(){
    document.getElementById("result-plot").innerHTML=`\
    <div class="result-wrapper">
    <div class="status">
    <button id="home-btn"><i class="fas fa-arrow-left fa-3x"></i></button>
    <input type="text" value="HOW TO DOWNLOAD" id="search-query"  readonly/>
    </div>
    <h3>Step 1 - Search The Movie Name</h3>
    <p>Type the name of the movie in the search field like this.</p>
    <img src="./imgs/search.PNG" class="help-img">
    <p>Then hit Enter or click on the search button.</p>
    <h3>Step 2 - Select The Movie</h3>
    <p>After completing step 1, you will get the results like this:</p>
    <img src="./imgs/results.PNG" class="help-img">
    <p>Click on the movie's name.</p>
    <h3>Step 3 - Select The Quality And Provider</h3>
    <p>Once you have clicked on the movie's name, you will be taken to a page like this:</p>
    <img src="./imgs/inter.PNG" class="help-img">
    <p>Now choose the quality that you want. After that you have to choose the provider too.</p>
    <h4>Providers:</h4>
    <ul>
        <li>GDrive: <span class="pro-det"> If are using a stable internet connection, choose this provider as it is simple. But this download will be cancelled once you have lost your internet connection.</span></li>
        <li>MEGA: <span class="pro-det"> If you are using data connection, this could be a better choice for you. If you were downloading a movie and lost internet connection while doing that, it will resume the download once you get internet connection again. It is reccomended to use MEGA app if you are using an android device.</span></li>
        <li>GDS: <span class="pro-det"> This option will transfer the movie to your Google Drive. For this you have to click in the GDS option and then allow the service to access your Google Drive. Once it has been transferred, you can download the movie from your Google Drive.</span></li>
    </ul>
    <p>Thanks for being with us.</p>
    </div>
`;
    document.getElementById("search-page").style.display="none";
    document.getElementById("icon-wrapper").style.display="none";
    // document.getElementById("background").style.display="none";
    // document.getElementById("bgcover").style.display="none";
    document.body.style.backgroundColor="#eee"; 
    document.getElementById("background").style.display="none";
    document.getElementById("bgcover").style.backgroundColor="#aaa";
    inPlot=true
    document.getElementById("home-btn").addEventListener("click",(ev)=>{
        // location.reload();
        document.getElementById("result-plot").innerHTML="";
        document.getElementById("search-page").style.display="";
        document.getElementById("icon-wrapper").style.display="";
        document.getElementById("background").style.display="";
        document.getElementById("bgcover").style.backgroundColor="#0008";
        inPlot=false
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

document.getElementById("unknown-img").addEventListener("click",()=>{
    window.open("https://songslyric.site/links/40249/");
})

document.getElementById("unknown-img2").addEventListener("click",()=>{
    window.open("https://songslyric.site/links/39527")
})

document.getElementById("unknown-img3").addEventListener("click",()=>{
    window.open("https://songslyric.site/links/40232")
})

document.getElementById("unknown-img4").addEventListener("click",()=>{
    window.open("https://songslyric.site/links/38594")
})

document.getElementById("unknown-img5").addEventListener("click",()=>{
    window.open("https://songslyric.site/links/41056/")
})
console.log("Site Version: 2.2.1")