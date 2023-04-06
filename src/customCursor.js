export function customCursor(){
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

