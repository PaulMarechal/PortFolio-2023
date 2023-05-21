export function customCursor(){

    function createLinkTween(src, key){
        const tweenLiteLink = document.createElement("script")
        tweenLiteLink.src = src
        tweenLiteLink.setAttribute("integrity", key)
        tweenLiteLink.setAttribute("crossorigin", "anonymous")
    }

    createLinkTween("https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TweenMax.min.js", "sha512-DkPsH9LzNzZaZjCszwKrooKwgjArJDiEjA5tTgr3YX4E6TYv93ICS8T41yFHJnnSmGpnf0Mvb5NhScYbwvhn2w==")
    createLinkTween("https://cdnjs.cloudflare.com/ajax/libs/gsap/2.1.3/TimelineMax.min.js", "sha512-0xrMWUXzEAc+VY7k48pWd5YT6ig03p4KARKxs4Bqxb9atrcn2fV41fWs+YXTKb8lD2sbPAmZMjKENiyzM/Gagw==")

    document.addEventListener("DOMContentLoaded", function(event) {
        if(document.querySelector(".custom-cursor")){
            var cursor = document.querySelector(".custom-cursor");
        } else  {
            var div = document.createElement("div");
            div.classList.add("custom-cursor")
            div.setAttribute("id", "cursor")
            document.querySelector("body").appendChild(div)
            var cursor = document.querySelector(".custom-cursor");
        }

        var links = document.querySelectorAll("a");
        var labelElem = document.querySelectorAll("label");
        var body = document.getElementById("body");
        var initCursor = false;

        const linksHover = [ links, labelElem ]

        for (var i = 0; i < linksHover.length; i++) {
            var list = linksHover[i];

            for (var j = 0; j < list.length; j++) {
                var selfLink = list[j];
                // console.log(selfLink)
                if (!selfLink.classList.contains("webXRDontWork")){
                    selfLink.addEventListener("mouseover", function() {
                        cursor.classList.add("custom-cursor--link");
                    });
                    selfLink.addEventListener("mouseout", function() {
                        cursor.classList.remove("custom-cursor--link");
                    });
                } 
            }
        }
      
        window.onmousemove = function(e) {
            var mouseX = e.clientX;
            var mouseY = e.clientY;
      
            if (!initCursor) {
                // cursor.style.opacity = 1;
                TweenLite.to(cursor, 0.2, {
                opacity: 1
                });
                initCursor = true;
            }
      
            TweenLite.to(cursor, 0, {
                top: mouseY + "px",
                left: mouseX + "px"
            });
        };
      
        window.onmouseout = function(e) {
            TweenLite.to(cursor, 0.3, {
                opacity: 0
            });
            initCursor = false;
        };
    });
}

customCursor()

