function assignHeaderListeners() {
    const navigationOnButton = document.querySelector("nav .menu");
    const navigationOffButton = document.querySelector("nav .cross");

    const navigationPanel = document.querySelector("nav .list");


    let classNames = ["slide-out", "slide-in"];
    let buttons = [navigationOnButton, navigationOffButton];
    let index = 0;
    function handleNavigationButton() {
        if (navigationPanel.hasAttribute("hidden")) {
            navigationPanel.removeAttribute("hidden");
        }
        navigationPanel.classList.remove(classNames[index]);
        buttons[index].setAttribute("hidden", "true");

        index ^= 1
        navigationPanel.classList.add(classNames[index]);
        buttons[index].removeAttribute("hidden");
    }

    navigationOnButton.addEventListener("click", handleNavigationButton);
    navigationOffButton.addEventListener("click", handleNavigationButton);
    document.querySelector("main").addEventListener("click", function (evt) {
        if (!navigationPanel.classList.contains("slide-out")) {
            navigationPanel.classList.remove(classNames[index]);
            buttons[index].setAttribute("hidden", "true");

            index ^= 1
            navigationPanel.classList.add(classNames[index]);
            buttons[index].removeAttribute("hidden");
        }
    });
}

function buildGallery(fileList, id) {
    let numPreview = 0;
    if (window.matchMedia('(min-width: 1025px)').matches) {
        // desktop
        numPreview = 5;
    } else if (window.matchMedia('(min-width: 668px)').matches) {
        // tablet
        numPreview = 3;
    } else if (window.matchMedia('(min-width: 481px)').matches) {
        // tablet
        numPreview = 2;
    } else {
        // smart phones
        numPreview = 1;
    }

    let numElems = numPreview + 2;

    let container = document.querySelector("#" + id + " .gallery");
    while (container.lastElementChild) {
        container.removeChild(container.lastElementChild);
    }

    for (let i = 0; i < numElems; i++) {
        let div = document.createElement("div");
        div.setAttribute("class", "card");
        let anchor = document.createElement("a");
        anchor.href = fileList[i];
        anchor.setAttribute("target", "_blank");
        let img = document.createElement("img");
        img.src = fileList[i];
        img.alt = "comment";
        if (i == 0 || i == numElems - 1) {
            div.setAttribute("hidden", "");
        }

        anchor.append(img);
        div.append(anchor);
        container.append(div);
    }
}

function assignGalleryListeners(fileList, id) {
    function album(imageFiles) {
        let is_valid = Array.isArray(imageFiles);

        let numFiles = imageFiles.length;
        let startIndex = 0;
        let currentIndex = startIndex;

        function goNext() {
            currentIndex++;
        }

        function goPrev() {
            if (currentIndex == 0) {
                currentIndex = numFiles - 1;
            } else {
                currentIndex--;
            }
        }

        function getImg(i) {
            return imageFiles[(currentIndex + i) % numFiles];
        }

        function getCurrent() {
            return getImg(0);
        }

        function dummy() { return ""; }

        if (is_valid) {
            return {
                goNext: goNext,
                goPrev: goPrev,
                getImg: getImg,
                getCurrent: getCurrent
            };
        }
        return {
            goNext: function () { },
            goPrev: function () { },
            getImg: dummy,
            getCurrent: dummy
        };
    }

    const toLeft = document.querySelector("#" + id + " .left");
    const toRight = document.querySelector("#" + id + " .right");
    const picElements = document.querySelectorAll("#" + id + " .card");

    let images = Object.create(album(fileList));

    toLeft.addEventListener("click", function () {
        for (let iElem = 0; iElem < picElements.length; iElem++) {
            let element = picElements[iElem];
            if (element.hasAttribute("hidden")) {
                element.removeAttribute("hidden");
            }
            if (iElem == picElements.length - 1) {
                element.classList.add("appear-in-right");
            } else {
                element.classList.add("to-left");
            }
        }
        images.goNext();
        firedLeft = true;
        console.log("trigger left");
    });

    toRight.addEventListener("click", function () {
        for (let iElem = 0; iElem < picElements.length; iElem++) {
            let element = picElements[iElem];
            if (element.hasAttribute("hidden")) {
                element.removeAttribute("hidden");
            }
            if (iElem == 0) {
                element.classList.add("appear-in-left");
            } else {
                element.classList.add("to-right");
            }
        }
        firedRight = true;
        console.log("trigger right");
        images.goPrev();
    });

    for (let iElem = 0; iElem < picElements.length; iElem++) {
        let element = picElements[iElem];
        element.addEventListener("animationend", function (event) {
            if (iElem == 0 || iElem == picElements.length - 1) {
                this.setAttribute("hidden", "");
            }
            this.classList.remove("to-right");
            this.classList.remove("to-left");
            this.classList.remove("appear-in-left");
            this.classList.remove("appear-in-right");
            this.querySelector("img").src = images.getImg(iElem);
        }, false);
    }
}

function shuffleArray(array) {
    array.sort(() => Math.random() - 0.5);
}

// let fileList1 = [
//     "img/lum01.png",
//     "img/lum02.png",
//     "img/lum03.png",
//     "img/lum04.png",
//     "img/lum05.png",
//     "img/lum06.png",
//     "img/lum07.png",
//     "img/lum08.png",
//     "img/lum09.png",
//     "img/lum10.png",
//     "img/lum11.png"];

let fileList1 = [
    "https://picsum.photos/1920/1080?random=1",
    "https://picsum.photos/1920/1080?random=2",
    "https://picsum.photos/1920/1080?random=3",
    "https://picsum.photos/1920/1080?random=4",
    "https://picsum.photos/1920/1080?random=5",
    "https://picsum.photos/1920/1080?random=6",
    "https://picsum.photos/1920/1080?random=7",
    "https://picsum.photos/1920/1080?random=8",
    "https://picsum.photos/1920/1080?random=9",
    "https://picsum.photos/1920/1080?random=10",
    "https://picsum.photos/1920/1080?random=11"
];

let fileList2 = fileList1.slice();

shuffleArray(fileList1);
shuffleArray(fileList2);

assignHeaderListeners();
buildGallery(fileList1, "haircut");
assignGalleryListeners(fileList1, "haircut");
buildGallery(fileList2, "nail-art");
assignGalleryListeners(fileList2, "nail-art");

window.onresize = function () {
    buildGallery(fileList1, "haircut");
    buildGallery(fileList2, "nail-art");
    assignGalleryListeners(fileList1, "haircut");
    assignGalleryListeners(fileList2, "nail-art");
}


