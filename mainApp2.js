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
let bulletdb
function UpdateDBToLocalStorage(){
    if(localStorage.getItem("db_commit_id")===null){
        localStorage.setItem('db_commit_id','')
    }
    if(localStorage.getItem("bullet_db")===null){
        localStorage.setItem('bullet_db',{})
    }
    current_commit_id=localStorage.getItem('db_commit_id')
    let latest_commit_id
    getJSON("https://api.github.com/repos/NurTasin/links/git/refs/heads/main",(err,data)=>{
        if(err){
            spawnBuildError(title="Unable To Connect To The GitHub API Server",msg="Can't Connect To 'https://api.github.com/repos/NurTasin/links/git/refs/heads/main'")
        }else{
            latest_commit_id=data.object.sha
            console.log(latest_commit_id)
            console.log(current_commit_id===latest_commit_id)
            if(current_commit_id===latest_commit_id){
                console.log("Using The Local Database As No Update Is Available.")
                bulletdb=JSON.parse(localStorage.getItem('bullet_db'))
                
            }else{
                console.log("Updating The Database As An Update Is Available.")
                getJSON("https://raw.githubusercontent.com/NurTasin/links/main/movies.json",(err,data)=>{
                    if(err){
                        spawnBuildError("Unable To Connect To The Database Server","Make Sure That You're Connected To The Internet And Try Again.")
                    }else{
                        bulletdb=data
                        localStorage.setItem("bullet_db",JSON.stringify(bulletdb))
                        localStorage.setItem("db_commit_id",latest_commit_id)
                    }
                })
            }
        }
    })
    
}
UpdateDBToLocalStorage()
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