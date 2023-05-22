document.getElementById('header').innerHTML = `
    <h1>PAUL <span>MARÉCHAL</span></h1>

    <input id="burger" type="checkbox"/>

    <label for="burger">
        <span></span>
        <span></span>
        <span></span>
    </label>

    <nav>    
        <ul id="menu"> 
            <!-- Home -->
            <li><a class="linkBurger" id="linkMenuHome" href="../">Home</a></li>
            <!-- Formations -->
            <li><a class="linkBurger" href="./Training/">Training</a></li>
            <!-- Réalisations -->
            <li><a class="linkBurger" href="./Archivements/">Achievements</a></li>
            <!-- Loisirs -->
            <li><a class="linkBurger" href="./Hobbies/">Hobbies</a></li>
            <li class="iconeBurgerMenu">
                <!-- Git -->
                <a href="https://github.com/PaulMarechal" target="_blank" id="iconeGit">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-github" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"></path>
                    </svg>
                </a>

                <!-- Site -->
                <a href="https://paulmarechal.xyz" target="_blank" id="iconeSite">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-world-www" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4"></path>
                        <path d="M11.5 3a16.989 16.989 0 0 0 -1.826 4"></path>
                        <path d="M12.5 3a16.989 16.989 0 0 1 1.828 4"></path>
                        <path d="M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4"></path>
                        <path d="M11.5 21a16.989 16.989 0 0 1 -1.826 -4"></path>
                        <path d="M12.5 21a16.989 16.989 0 0 0 1.828 -4"></path>
                        <path d="M2 10l1 4l1.5 -4l1.5 4l1 -4"></path>
                        <path d="M17 10l1 4l1.5 -4l1.5 4l1 -4"></path>
                        <path d="M9.5 10l1 4l1.5 -4l1.5 4l1 -4"></path>
                    </svg>
                </a>

                <!-- Mail -->
                <a href="mailto:contactme@paulmarechal.xyz" id="iconeMail">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-mail" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                        <path d="M3 7l9 6l9 -6"></path>
                    </svg>
                </a>

                <!-- LinkedIn -->
                <a href="https://www.linkedin.com/in/paul-marechal/" target="_blank" id="iconeLinkedin">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-brand-linkedin" width="24" height="24" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                        <path d="M8 11l0 5"></path>
                        <path d="M8 8l0 .01"></path>
                        <path d="M12 16l0 -5"></path>
                        <path d="M16 16v-3a2 2 0 0 0 -4 0"></path>
                    </svg>
                </a>
            </li>
        </ul>  
    </nav>
`

const checkbox = document.getElementById("burger")
const menu = document.getElementById("menu")
const linkMenuHome = document.getElementById("linkMenuHome")

checkbox.addEventListener("click", event => {
    if (checkbox.checked) {
        menu.style.opacity = "1";
        menu.style.pointerEvents = "auto"; 
    } else {
        menu.style.opacity = "0";
        menu.style.pointerEvents = "none"; 
    }
});

// Added Home link on menu
var currentURL = window.location.href;

// Def homepage URL
// var homeURL = "https://paulmarechal.xyz/portfolio/";
var homeURL = "http://localhost:5173/";

if (currentURL !== homeURL) {
  linkMenuHome.style.display = "block"
} else {
  linkMenuHome.style.display = "none"
}
  


