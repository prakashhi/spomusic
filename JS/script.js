
let currentsong = new Audio()
let currentstaus
let newsongsd
let cuurfolder
let songsd




async function getsongs(folder) {
    //getsongs from url
    cuurfolder = folder;

    let song = await fetch(`/${cuurfolder}/`)
    let responce = await song.text()
    let div = document.createElement("div")
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")


    let songs = []
    for (i = 0; i < as.length; i++) {
        let b = as[i]
        if (b.title.endsWith(".mp3")) {
            songs.push(`/${cuurfolder}/` + b.title)
        }

    }
    return songs


}

const playmusic = (track) => {

    // let audio = new Audio("http://127.0.0.1:5500/Songs/" + track)

    currentsong.src = `/${cuurfolder}/` + track

    document.querySelector(".songinfo").innerHTML = `<div class="songname"><marquee behavior="" direction="right">${track.split("/").slice(-1)[0]}</marquee></div>`
    document.querySelector(".time").innerHTML = `00:00`

    currentsong.play()

    playbtn.src = "Svg/pause.svg"

}
const songlist = () => {
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""


    for (const i of songsd) {
        songul.innerHTML = songul.innerHTML + `<li><img class="" src="Svg/music.svg">${i.split(`/${cuurfolder}/`)[1]}<li>`

    }

}

const convertSecondsToMinutesAndSeconds = (seconds) => {
    //convertSecondsToMinutesAndSeconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds} `;

}

const Timeupdate = () => {
    //time update
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".time").innerHTML = `${convertSecondsToMinutesAndSeconds(currentsong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

}
const prevoiussong = () => {
    //play prevoius song

    let currentsong1 = currentsong.attributes.src

    let index = songsd.indexOf(currentsong1.nodeValue)
    if (index >= 0) {
        playmusic(songsd[index - 1])
    }
    else {
        alert("Last index song")
    }


}
const nextsong = () => {
    //play next song

    let currentsong1 = currentsong.attributes.src

    let index = songsd.indexOf(currentsong1.nodeValue)

    if (index <= songsd.length) {
        playmusic(songsd[index + 1])
    } else {
        alert("End index song")
    }
}
const hamburger = () => {
    //hamburger use
    document.querySelector(".left").style.left = "0%";

    document.querySelector(".closebtn").addEventListener('click', () => {
        document.querySelector(".left").style.left = "-100%";
    })

}
const load_list = () => {
    // Load the playlist when card clicked
    document.querySelectorAll(".card").forEach(element => {
        element.addEventListener('click', async iteam => {

            songsd = await getsongs(`Songs/${iteam.currentTarget.dataset.folder}`)
            // songlist
            songlist();

            // Play from playlsit
            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
                e.addEventListener('click', () => {
                    if (e.innerText.endsWith(".mp3")) {

                        playmusic(e.textContent)

                    }

                })

            })

        })


    });

}
async function displayallAlbums() {
    let song = await fetch(`/Songs/`)
    let responce = await song.text()
    let div = document.createElement("div")
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")

    Array.from(as).forEach(async element => {
        if (element.href.includes("/Songs/")) {
            let folder = element.href.split("/").slice(-2)[0]

            //   get the metadata
            let a = await fetch(`/Songs/${folder}/info.json`)
            let responce = await a.json();

            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div  data-folder="${folder}" class="card">
            <div class="play invert">
                <img src="Svg/play.svg" alt="">
            </div>
            <img src="Songs/${folder}/${responce.img}" alt="">
            <h3>${responce.Title}</h3>
            <p>${responce.description}</p>
            </div>`
        }
        load_list();



    });


}







async function main() {

    //display all albums
    displayallAlbums()



    // Play song with button
    document.querySelector("#playbtn").addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            playbtn.src = "Svg/pause.svg"
        }
        else {
            currentsong.pause()
            playbtn.src = "Svg/play.svg"
        }

    })


    Timeupdate();

    //hamburger use        
    document.querySelector(".home").insertAdjacentHTML("beforebegin", `<img  width="30px"class="closebtn invert "  src="Svg/close.svg">`)
    document.querySelector(".hamburger").addEventListener('click', () => {
        hamburger();

    })


    //play next and previous song
    document.querySelector("#previousbtn").addEventListener('click', () => {
        prevoiussong();
    })

    document.querySelector("#nextbtn").addEventListener('click', () => {
        nextsong();
    })

    //volume buuton
    document.querySelector(".range").addEventListener('change', (e) => {
        currentsong.volume = e.target.value / 100
    })


    //mute volume 
    document.querySelector(".volumebtn").addEventListener("click", (e) => {
        currentsong.volume = 0
        document.querySelector(".range").value=0
    
        
    })



}
main()



