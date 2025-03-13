let currentsong = new Audio();
let cuurfolder;
let songsd;

async function getsongs(folder) {
    cuurfolder = folder;

    // Fetch the songs.json file to get the list of songs
    let songListResponse = await fetch(`${cuurfolder}/songs.json`);
    let songListData = await songListResponse.json();

    // Generate full URLs for each song and return the list
    let songs = songListData.songs.map(song => `${cuurfolder}/${song}`);
    
    return songs;
}

const playmusic = (track) => {
    currentsong.src = `${cuurfolder}/` + track;
    document.querySelector(".songinfo").innerHTML = `<div class="songname"><marquee behavior="" direction="right">${track.split("/").slice(-1)[0]}</marquee></div>`;
    document.querySelector(".time").innerHTML = `00:00`;

    currentsong.play();
    playbtn.src = "Svg/pause.svg";
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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds}`;
}

const Timeupdate = () => {
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".time").innerHTML = `${convertSecondsToMinutesAndSeconds(currentsong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });
}

const prevoiussong = () => {
    let so = [];
    let currentsong1 = currentsong.attributes.src.value;
    for (const i of songsd) {
        so.push(i.split("/").slice(-1)[0]);
    }

    let index = so.indexOf(currentsong1.split("/").slice(-1)[0]);

    try {
        if (index > 0) {
            playmusic(so[index - 1]);
        }
    } catch (error) {
        alert("End of songlist");
    }
}

const nextsong = () => {
    let so = [];
    let currentsong1 = currentsong.attributes.src.value;
    for (const i of songsd) {
        so.push(i.split("/").slice(-1)[0]);
    }

    let index = so.indexOf(currentsong1.split("/").slice(-1)[0]);

    try {
        if (index < so.length - 1) {
            playmusic(so[index + 1]);
        }
    } catch (error) {
        alert("End of songlist");
    }
}

const hamburger = () => {
    document.querySelector(".left").style.left = "0%";

    document.querySelector(".closebtn").addEventListener('click', () => {
        document.querySelector(".left").style.left = "-100%";
    });
}

const load_list = () => {
    document.querySelectorAll(".card").forEach(element => {
        element.addEventListener('click', async iteam => {
            songsd = await getsongs(`Songs/${iteam.currentTarget.dataset.folder}`);

            // songlist
            songlist();

            // Play from playlist
            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
                e.addEventListener('click', () => {
                    if (e.innerText.endsWith(".mp3")) {
                        playmusic(e.textContent);
                    }
                });
            });
        });
    });
}

async function displayallAlbums() {
    let cardcontainer = document.querySelector(".cardcontainer");

    // List of folders in Songs directory (You can use static paths or dynamically add them)
    let albumFolders = ['CS', 'English_Hits','My_Folder','NCS','Random']; // Add album folder names manually or dynamically

    // Loop through each album folder and create album cards
    for (let folder of albumFolders) {
        // Fetch album metadata from info.json
        let a = await fetch(`Songs/${folder}/info.json`);
        let albumData = await a.json();

        // Create album card in HTML
        cardcontainer.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="play invert">
                    <img src="Svg/play.svg" alt="Play">
                </div>
                <img src="Songs/${folder}/${albumData.img}" alt="Cover Image">
                <h3>${albumData.Title}</h3>
                <p>${albumData.description}</p>
            </div>`;
    }

    // Call the load_list function to attach event listeners to the album cards
    load_list();
}

async function main() {
    // Display all albums
    displayallAlbums();

    // Play song with button
    document.querySelector("#playbtn").addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            playbtn.src = "Svg/pause.svg";
        } else {
            currentsong.pause();
            playbtn.src = "Svg/play.svg";
        }
    });

    Timeupdate();

    // Hamburger menu
    document.querySelector(".home").insertAdjacentHTML("beforebegin", `<img  width="30px"class="closebtn invert "  src="Svg/close.svg">`);
    document.querySelector(".hamburger").addEventListener('click', () => {
        hamburger();
    });

    // Play next and previous song
    document.querySelector("#previousbtn").addEventListener('click', () => {
        prevoiussong();
    });

    document.querySelector("#nextbtn").addEventListener('click', () => {
        nextsong();
    });

    // Volume button
    document.querySelector(".range").addEventListener('change', (e) => {
        currentsong.volume = e.target.value / 100;
    });

    // Mute volume
    document.querySelector(".volumebtn").addEventListener("click", (e) => {
        currentsong.volume = 0;
        document.querySelector(".range").value = 0;
    });
}

main();
