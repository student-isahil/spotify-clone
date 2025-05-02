
let currentSong = new Audio();
let songs;
let currFolder;
let currentSongIndex;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`https://student-isahil.github.io/spotify-clone/${folder}/info.json`)
    let data = await a.json();

    songs = data.songs;

    // Show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML += `<li><img class="invert" width="34" src="assests/images/music.svg" alt="">
            <div class="info">
                <div>${song.title}</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="assests/images/play.svg" alt="">
            </div> </li>`;
    }

    // Attach an event listener to each song in the playlist
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e, index) => {
        e.addEventListener("click", () => {
            playMusic(index); // Pass index of the clicked song
        });
    });

    return songs
}

const playMusic = (index, pause = false) => {

    currentSong.pause();
    currentSongIndex = index;
    currentSong.src = songs[index].url;
    if (!pause) {
        currentSong.play()
        play.src = "assests/images/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = songs[index].title;
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}


async function displayAlbums() {

    let a = await fetch("https://student-isahil.github.io/spotify-clone/info1.json");
    let folders = await a.json();

    let cardContainer = document.querySelector(".cardContainer")

    for (let folder of folders) {
        try 
        {
            let a = await fetch(`https://student-isahil.github.io/spotify-clone/songs/${folder}/info.json`);
            let response = await a.json();

            cardContainer.innerHTML += ` 
            <div data-folder="${folder}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="${response.cover}" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`;
        } catch (error) {
            console.error(`Error loading album ${folder}:`, error);
        }

        // Load the playlist whenever card is clicked
        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
                playMusic(0)
            })
        })
    }
}

    async function main() {
        // Get the list of all the songs
        await getSongs("songs/ncs")
        // await getSongs("https://student-isahil.github.io/spotify-clone/songs/ncs/info.json")

        playMusic(0, true)

        // Display all the albums on the page
        await displayAlbums()

        // Add an event listener for hamburger
        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = "0"
        })

        // Add an event listener for close button
        document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-120%"
        })

        // Attach an event listener to play, next and previous
        play.addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play()
                play.src = "assests/images/pause.svg"
            }
            else {
                currentSong.pause()
                play.src = "assests/images/play.svg"
            }
        })


        // Previous song
        previous.addEventListener("click", () => {
            if (currentSongIndex > 0) {
                currentSong.pause();
                playMusic(currentSongIndex - 1);
            }
        });

        // Next song
        next.addEventListener("click", () => {
            if (currentSongIndex < songs.length - 1) {
                currentSong.pause();
                console.log(currentSongIndex);
                playMusic(currentSongIndex + 1);
            }
        });

        // Listen for timeupdate event
        currentSong.addEventListener("timeupdate", () => {
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
            // document.querySelector(".fill").style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%";
            document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
        })

        // Add an event listener to seekbar
        document.querySelector(".seekbar").addEventListener("click", e => {
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            // document.querySelector(".fill").style.width =  percent + "%";
            document.querySelector(".circle").style.left = percent + "%";
            currentSong.currentTime = ((currentSong.duration) * percent) / 100
        })

        // Add an event to volumeicon
        document.querySelector(".volumerange").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            currentSong.volume = parseInt(e.target.value) / 100
            if (currentSong.volume > 0) {
                document.querySelector(".volumeicon>img").src = document.querySelector(".volumeicon>img").src.replace("mute.svg", "volume.svg")
            }
            else {
                document.querySelector(".volumeicon>img").src = document.querySelector(".volumeicon>img").src.replace("volume.svg", "mute.svg")
            }
        })

        // Add event listener to mute the track
        document.querySelector(".volumeicon>img").addEventListener("click", e => {
            if (e.target.src.includes("volume.svg")) {
                e.target.src = e.target.src.replace("volume.svg", "mute.svg")
                currentSong.volume = 0;
                document.querySelector(".volumerange").getElementsByTagName("input")[0].value = 0;
            }
            else {
                e.target.src = e.target.src.replace("mute.svg", "volume.svg")
                currentSong.volume = .10;
                document.querySelector(".volumerange").getElementsByTagName("input")[0].value = 10;
            }

        })




    }

    main() 
