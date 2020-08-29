window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (f) {
    return setTimeout(f, 1000 / 60);
  };

const winHeight = {
  height: window.innerHeight,
};

const windowHeight = function () {
  winHeight.height = window.innerHeight;
  document.documentElement.style.setProperty(
    "--window-innerHeight",
    winHeight.height + "px"
  );
};
window.onload = () => {
  document.documentElement.style.setProperty(
    "--window-innerHeight",
    winHeight.height + "px"
  );
};
window.onresize = windowHeight;

let domSelector = (function () {
  const container = document.querySelector(".container");
  const previewImg = document.querySelector(".container__preview  img");
  const containerPreview = document.querySelector(".container__preview");
  const containerSlider = document.querySelector(".container__slider");
  const thumbnails = document.querySelectorAll(".thumbnail img");
  const leftButton = document.querySelector(".leftbutton");
  const rightButton = document.querySelector(".rightbutton");
  const thumbnailContainer = document.querySelector(
    ".container__slider--thumbnail"
  );
  const tooltip = document.querySelector(".tooltip");
  const fullscreen = document.querySelector(".fullscreen");
  const slideshow = document.querySelector(".slideshow");
  const setting = document.querySelector(".setting");
  const settingContainer = document.querySelector(".container__setting");
  const settingClose = document.querySelector(".close");
  const shortcut = document.querySelector(".shortcut");
  const shortcutDetails = document.querySelector(".shortcut--details");
  const shortcutBack = document.querySelector(".back");
  const slideIntarval = document.querySelector("#timing");
  return {
    container: container,
    previewImg: previewImg,
    containerPreview: containerPreview,
    containerSlider: containerSlider,
    thumbnails: thumbnails,
    leftButton: leftButton,
    rightButton: rightButton,
    thumbnailContainer: thumbnailContainer,
    fullscreen: fullscreen,
    tooltip: tooltip,
    slideshow: slideshow,
    setting: setting,
    settingContainer: settingContainer,
    settingClose: settingClose,
    shortcut: shortcut,
    shortcutDetails: shortcutDetails,
    shortcutBack: shortcutBack,
    slideIntarval: slideIntarval,
  };
})();
// ***************************************************************************************************************
// ***************************************************************************************************************
// ***************************************************************************************************************
// ***************************************************************************************************************
// ***************************************************************************************************************
// ***************************************************************************************************************
// ***************************************************************************************************************
(function gallery(DOM) {
  let activeElement = DOM.thumbnails[0].parentElement;
  let indexOfActiveElement = 0;
  let slideshowSetIntervalID;
  let slideshowInterval = 3000;
  let slideshowDirection = 'forward';

  function updateThumbnail(x) {
    //remove active class from active eliment
    activeElement.classList.remove("active");
    //change activeElement to e.target
    activeElement = x.parentElement;
    //add active class to activeElement
    activeElement.classList.add("active");
  }

  function updatePreview() {
    DOM.previewImg.src = activeElement.firstElementChild.src;
  }

  for (let i = 0; i < DOM.thumbnails.length; i++) {
    DOM.thumbnails[i].addEventListener("click", (e) => {
      updateThumbnail(e.target);
      //update indexofactiveElement
      indexOfActiveElement = i;
      updatePreview();
    });
  }
  /********************************************************************************************* */
  const leftButtonEvent = (e) => {
    if (activeElement === DOM.thumbnails[0].parentElement) {
      clearInterval(slideshowSetIntervalID); //if any setinterval running
      return;
    } else {
      indexOfActiveElement -= 1;
      updateThumbnail(DOM.thumbnails[indexOfActiveElement]);
      updatePreview();
      activeElement = DOM.thumbnails[indexOfActiveElement].parentElement;
    }
    scroll(1000);
  };
  //left button
  DOM.leftButton.addEventListener("click", leftButtonEvent);
  /***************************************************************************************************** */
  const rightButtonEvent = (e) => {
    if (
      activeElement === DOM.thumbnails[DOM.thumbnails.length - 1].parentElement
    ) {
      clearInterval(slideshowSetIntervalID); //if any setinterval running
      return;
    } else {
      indexOfActiveElement++;
      updateThumbnail(DOM.thumbnails[indexOfActiveElement]);
      updatePreview();
      activeElement = DOM.thumbnails[indexOfActiveElement].parentElement;
    }
    scroll(1000);
  };
  //right button
  DOM.rightButton.addEventListener("click", rightButtonEvent);

  //scroll event //mouse wheel
  // DOM.thumbnailContainer.addEventListener()
  window.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) {
      DOM.thumbnailContainer.scrollLeft += 400;
    } else {
      DOM.thumbnailContainer.scrollLeft -= 400;
    }
  });

  function scroll(duration) {
    let target = activeElement;
    let thumbnailOffset = target.getBoundingClientRect().left;
    let widthOfContainer = DOM.thumbnailContainer.getBoundingClientRect().width;
    let startPosition = thumbnailOffset;
    let targetposition = widthOfContainer - 90;
    let distance = targetposition - startPosition;
    let startTime = null;

    function animateScroll(currentTime) {
      if (startTime === null) startTime = currentTime;
      let timeElapsed = currentTime - startTime;
      move(distance);

      function move(amount) {
        if (startPosition > targetposition) {
          DOM.thumbnailContainer.scrollLeft += -amount + 3;
        } else if (startPosition < 55) {
          DOM.thumbnailContainer.scrollLeft += startPosition - 65;
        }
      }
    }
    requestAnimationFrame(animateScroll);
  }
  /*************************************************************************************************** */
  //mouseover fullscreen btn
  const fullscreenmouseenter = (e) => {
    if (DOM.fullscreen.firstElementChild.classList.contains("fullscreened")) {
      DOM.tooltip.innerText = "Fullscreen(f)";
    } else if (
      DOM.fullscreen.firstElementChild.classList.contains("windowed")
    ) {
      DOM.tooltip.innerText = "Windowed(w)";
    }
    DOM.tooltip.style.top =
      DOM.fullscreen.getBoundingClientRect().top - 40 + "px";
    DOM.tooltip.style.left =
      DOM.fullscreen.getBoundingClientRect().left - 25 + "px";
    DOM.tooltip.style.display = "block";
    DOM.tooltip.style.opacity = "1";
    DOM.tooltip.style.transition = ".5s";
  };
  DOM.fullscreen.addEventListener("mouseenter", fullscreenmouseenter);
  const fullscreenmouseleave = (e) => {
    DOM.tooltip.style.transition = ".5s";
    DOM.tooltip.style.opacity = "0";
    setTimeout(() => {
      DOM.tooltip.style.display = "none";
    }, 500);
  };
  DOM.fullscreen.addEventListener("mouseleave", fullscreenmouseleave);
  /******************************************************************************************************* */
  //fullscreen function
  const fullscreen = (e) => {
    if (DOM.fullscreen.firstElementChild.classList.contains("fullscreened")) {
      let x = winHeight.height;
      DOM.containerPreview.style.height = x + "px";
      DOM.containerPreview.style.transition = "1s";

      setTimeout(() => {
        DOM.containerSlider.style.display = "none";
      }, 1000);

      //change fullscreen icon to windowed icon
      DOM.fullscreen.innerHTML =
        '<svg class="icon-android-contract windowed"><use xlink:href="#icon-android-contract"></use></svg>';
      //update position of tooltip
      DOM.tooltip.style.top =
        DOM.fullscreen.getBoundingClientRect().top - 40 + "px";
      DOM.tooltip.style.left =
        DOM.fullscreen.getBoundingClientRect().left - 25 + "px";
    } else if (
      DOM.fullscreen.firstElementChild.classList.contains("windowed")
    ) {
      DOM.containerPreview.style.height = "80%";
      DOM.containerPreview.style.transition = "1s";
      DOM.containerSlider.style.display = "flex";

      //change fullscreen icon to windowed icon
      DOM.fullscreen.innerHTML =
        '<svg class="icon-android-expand fullscreened"><use xlink:href="#icon-android-expand"></use></svg>';
      //update position of tooltip
      DOM.tooltip.style.top =
        DOM.fullscreen.getBoundingClientRect().top - 40 + "px";
      DOM.tooltip.style.left =
        DOM.fullscreen.getBoundingClientRect().left - 25 + "px";
    }
  };
  DOM.fullscreen.addEventListener("click", fullscreen);

  /**************************************************************** */

  // if user pree f11 then->
  /*  check if preview is fullscreened then change its height to window innerHeight */
  /**************************************************************** */
  window.onresize = function () {
    if (DOM.fullscreen.firstElementChild.classList.contains("windowed")) {
      windowHeight();
      DOM.containerPreview.style.height = winHeight.height + "px";
    } else if (
      DOM.fullscreen.firstElementChild.classList.contains("fullscreened")
    ) {
      windowHeight();
    }
  };
  /******************************************************************************************* */
  //mouse over slideshow button
  const slideshowmouseenter = (e) => {
    if (DOM.slideshow.firstElementChild.classList.contains("play")) {
      DOM.tooltip.innerText = "Play Slideshow(spacebar)";
    } else if (DOM.slideshow.firstElementChild.classList.contains("stop")) {
      DOM.tooltip.innerText = "Stop Slideshow(spacebar)";
    }
    DOM.tooltip.style.top =
      DOM.slideshow.getBoundingClientRect().top - 40 + "px";
    DOM.tooltip.style.left =
      DOM.slideshow.getBoundingClientRect().left - 25 + "px";
    DOM.tooltip.style.display = "block";
    DOM.tooltip.style.opacity = "1";
    DOM.tooltip.style.transition = ".5s";
  };
  DOM.slideshow.addEventListener("mouseenter", slideshowmouseenter);

  const slideshowmouseleave = (e) => {
    DOM.tooltip.style.transition = ".5s";
    DOM.tooltip.style.opacity = "0";
    setTimeout(() => {
      DOM.tooltip.style.display = "none";
    }, 500);
  };
  DOM.slideshow.addEventListener("mouseleave", slideshowmouseleave);
  /*********************************************************** */
  // slideshow play stop
  const slideshow = (e) => {

    if (DOM.slideshow.firstElementChild.classList.contains("play")) {
      if (slideshowDirection === "forward") {
        DOM.slideshow.innerHTML =
          '<svg class="icon-stop stop"><use xlink:href="#icon-stop"></use></svg>';
        slideshowSetIntervalID = setInterval(() => {
          rightButtonEvent(e);
          if (DOM.slideshow.firstElementChild.classList.contains("stop")) {
            if (indexOfActiveElement === DOM.thumbnails.length - 1) {
              DOM.slideshow.innerHTML =
                '<svg class="icon-play play"><use xlink:href="#icon-play"></use></svg>';
              clearInterval(slideshowSetIntervalID);
            }
          }
        }, slideshowInterval);
      } else {
        DOM.slideshow.innerHTML =
          '<svg class="icon-stop stop"><use xlink:href="#icon-stop"></use></svg>';
        slideshowSetIntervalID = setInterval(() => {
          leftButtonEvent(e);
          if (DOM.slideshow.firstElementChild.classList.contains("stop")) {
            if (indexOfActiveElement === 0) {
              DOM.slideshow.innerHTML =
                '<svg class="icon-play play"><use xlink:href="#icon-play"></use></svg>';
              clearInterval(slideshowSetIntervalID);
            }
          }
        }, slideshowInterval);
      }
    } else if (DOM.slideshow.firstElementChild.classList.contains("stop")) {
      DOM.slideshow.innerHTML =
        '<svg class="icon-play play"><use xlink:href="#icon-play"></use></svg>';
      clearInterval(slideshowSetIntervalID);
    }
  };
  DOM.slideshow.addEventListener("click", slideshow);
  //keyboard event //arrow keys
  window.addEventListener("keyup", (e) => {
    if (e.keyCode === 37) {
      //left arrow
      leftButtonEvent();
    } else if (e.keyCode === 39) {
      //right arrow
      rightButtonEvent();
    } else if (e.keyCode === 70) {
      //key f
      if (DOM.fullscreen.firstElementChild.classList.contains("fullscreened")) {
        fullscreen(e);
      }
    } else if (e.keyCode === 87) {
      if (DOM.fullscreen.firstElementChild.classList.contains("windowed")) {
        fullscreen(e);
      }
    } else if (e.keyCode === 32) {
      //spacebar
      slideshow(e);
    } else if (e.keyCode === 36) {
      //home
      updateThumbnail(DOM.thumbnails[0]);
      indexOfActiveElement = 0;
      updatePreview();
      DOM.thumbnailContainer.scrollLeft = 0;
    } else if (e.keyCode === 35) {
      //end key
      updateThumbnail(DOM.thumbnails[DOM.thumbnails.length - 1]);
      indexOfActiveElement = DOM.thumbnails[DOM.thumbnails.length - 1];
      updatePreview();
      DOM.thumbnailContainer.scrollLeft = DOM.thumbnailContainer.scrollWidth;
    }
  });
  /***************************************************** */
  /*            TOUCH       swipe      */
  /******************************************************** */
  let touchstartclientx;
  DOM.containerPreview.addEventListener("touchstart", (e) => {
    e.preventDefault();
    touchstartclientx = e.touches[0].clientX;
  });

  DOM.containerPreview.addEventListener("touchend", (e) => {
    e.preventDefault();
    // console.log(e);
    let touchendclientx = e.changedTouches[0].clientX;
    let difference = touchstartclientx - touchendclientx;
    let width = DOM.containerPreview.clientWidth;
    // console.log(width);
    if (Math.abs(difference) >= width / 4) {
      if (difference > 0) {
        rightButtonEvent();
      } else {
        leftButtonEvent();
      }
    }
  });

  /********************************************* */
  // touch play button
  DOM.slideshow.addEventListener("touchstart", (e) => {
    slideshowmouseenter();
    slideshow();
  });
  DOM.slideshow.addEventListener("touchend", (e) => {
    setTimeout(() => {
      slideshowmouseleave();
    }, 500);
  });

  //touch fullscreenbtn
  DOM.fullscreen.addEventListener("touchstart", (e) => {
    fullscreenmouseenter();
    fullscreen();
  });
  DOM.fullscreen.addEventListener("touchend", (e) => {
    setTimeout(() => {
      fullscreenmouseleave();
    }, 500);
  });
  /************************************************************ */
  //setting button
  //change value

  const settingfunc = (e) => {
    DOM.settingContainer.style.top =
      DOM.setting.getBoundingClientRect().top - 300 + "px";
    DOM.settingContainer.style.display = "unset";
    //stop intarval
    if (DOM.slideshow.firstElementChild.classList.contains("stop")) {
      DOM.slideshow.innerHTML =
        '<svg class="icon-play play"><use xlink:href="#icon-play"></use></svg>';
      clearInterval(slideshowSetIntervalID);
    }
    //update interval
    DOM.slideIntarval.addEventListener("change", (e) => {
      slideshowInterval = e.target.value * 1000;
    });
  };
  DOM.setting.addEventListener("click", settingfunc);
  DOM.setting.addEventListener("touchstart", settingfunc);

  /***************************************************************** */

  DOM.shortcut.addEventListener("click", (e) => {
    DOM.settingContainer.style.display = "none";
    DOM.shortcutDetails.style.display = "block";
  });
  DOM.shortcut.addEventListener("touchstart", (e) => {
    DOM.settingContainer.style.display = "none";
    DOM.shortcutDetails.style.display = "block";
  });
  DOM.shortcutBack.addEventListener("click", (e) => {
    DOM.shortcutDetails.style.display = "none";
    DOM.settingContainer.style.display = "block";
  });
  DOM.shortcutBack.addEventListener("touchstart", (e) => {
    DOM.shortcutDetails.style.display = "none";
    DOM.settingContainer.style.display = "block";
  });

  DOM.settingClose.addEventListener("click", (e) => {
    DOM.settingContainer.style.display = "none";
    slideshowDirection = document.querySelector(
      'input[name="direction"]:checked'
    ).value;
  });
  DOM.settingClose.addEventListener("touchstart", (e) => {
    DOM.settingContainer.style.display = "none";
    slideshowDirection = document.querySelector(
      'input[name="direction"]:checked'
    ).value;
  });
})(domSelector);
