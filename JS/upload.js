
let currentsong = new Audio()
let currentstaus
let newsongsd
let cuurfolder
let songsd
let i



async function getsongs(folder) {
    cuurfolder = folder;

    // Fetch the JSON file containing the list of songs in the folder
    let songListResponse = await fetch(`${cuurfolder}/songs.json`);
    let songListData = await songListResponse.json();

    // Create full URLs for each song and return the list
    let songs = songListData.songs.map(song => `${cuurfolder}/${song}`);
    
    return songs;
}


const playmusic = (track) => {

    currentsong.src = `${cuurfolder}/` + track

    document.querySelector(".songinfo").innerHTML = `<div class="songname"><marquee behavior="" direction="right">${track.split("/").slice(-1)[0]}</marquee></div>`
    document.querySelector(".time").innerHTML = `00:00`

    currentsong.play()

    playbtn.src = "Svg/pause.svg"



}
const songlist = () => {
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = ""; // Clear the current list

    // Iterate over the fetched songs and display them
    for (const song of songsd) {
        songul.innerHTML += `<li><img src="Svg/music.svg">${song.split("/").slice(-1)[0]}</li>`;
    }

    // Add event listeners to each song for playing
    Array.from(songul.getElementsByTagName("li")).forEach((li) => {
        li.addEventListener('click', () => {
            let songName = li.innerText;
            playmusic(songName);
        });
    });
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


    let so = []
    let currentsong1 = currentsong.attributes.src.value
    for (const i of songsd) {
        so.push(i.split("/").slice(-1)[0])
    }

    let index = so.indexOf(currentsong1.split("/").slice(-1)[0])

    try {
        if (index >= 0) {
            playmusic(so[index - 1])
        }
    } catch (error) {
        alert("End of songlist")
    }


}
const nextsong = () => {
    //play next song
    let so = []
    let currentsong1 = currentsong.attributes.src.value
    for (const i of songsd) {
        so.push(i.split("/").slice(-1)[0])
    }

    let index = so.indexOf(currentsong1.split("/").slice(-1)[0])

    try {
        if (index <= so.length) {
            playmusic(so[index + 1])
        }
    } catch (error) {
        alert("End of songlist")
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

            


            songsd = await getsongs(`Songs/${iteam.currentTarget.dataset.folder}`);

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
    let song = await fetch(`Songs/`);

    let responce = await song.text();

    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")
    let cardcontainer = document.querySelector(".cardcontainer")


    Array.from(as).forEach(async element => {
        if (element.href.includes("/Songs/")) {
            let folder = element.href.split("/").slice(-2)[1]

            //   get the metadata
            let a = await fetch(`Songs/${folder}/info.json`)

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
        document.querySelector(".range").value = 0


    })



}
main()



