const def = new Map([
    [
      "slide1", 
      {
        id: "slide1",
        top: 500, 
        bottom: 1900, 
        topStyle: { 
          opacity: 0,
          translateY: -60,
        },
        bottomStyle: { 
          opacity: 0,
          translateY: 60,
        },
        animations: [
          {
            enabled: false, 
            top: 500,
            bottom: 1900, 
            easing: midSlow, 
            styles: [ 
              {
                name: "translateY", 
                topValue: 60, 
                bottomValue: -60, 
              },
            ],
          },
          {
            enabled: false,
            top: 500,
            bottom: 800,
            easing: ease,
            styles: [
              {
                name: "opacity",
                topValue: 0,
                bottomValue: 1,
              },
            ],
          },
          {
            enabled: false,
            top: 1400,
            bottom: 1900,
            easing: easeIn,
            styles: [
              {
                name: "opacity",
                topValue: 1,
                bottomValue: 0,
              },
            ],
          },
        ],
      },
    ],
    
  ]);

  const elements = {
    "sticky-container": document.getElementById("sticky-container"),
    "scroll-down": document.getElementById("scroll-down"),
    slide1: document.getElementById("slide1"),
    slide2: document.getElementById("slide2"),
    slide3: document.getElementById("slide3"),
    "moving-background": document.getElementById("moving-background"),
    slide4: document.getElementById("slide4"),
    slide5: document.getElementById("slide5"),
  };
  function initAnimation() {
   
    elements["sticky-container"].style.height = `7100px`;
    
    def.forEach((obj, id) => {
      disabled.set(id, obj);
    });
    
    disabled.forEach((obj, id) => {
      Object.keys(obj.topStyle).forEach((styleName) => {
        const pushValue = obj.topStyle[styleName];
        applyStyle(elements[id], styleName, pushValue);
      });
    });
   
    onScroll();
  }
  initAnimation();
  window.addEventListener("scroll", onScroll);

  function applyStyle(element, styleName, value) {
    if (styleName === "translateY") {
      element.style.transform = `translateY(${value}px)`;
      return;
    }
    if (styleName === "translateX") {
      element.style.transform = `translateX(${value}px)`;
      return;
    }
    element.style[styleName] = `${value}`;
  }
  function applyStyles(id, styles, rate) {
    styles.forEach((style) => {
      const { name, topValue, bottomValue } = style;
      const value = getPoint(topValue, bottomValue, rate);
      applyStyle(elements[id], name, value);
    });
  }
  function applyAnimations(currentPos, id) {
    const animations = def.get(id)?.animations;
    if (!animations) {
      return;
    }
    animations.forEach((animation) => {
      const { top: a_top, bottom: a_bottom, easing, styles } = animation;
      const isIn = isAmong(currentPos, a_top, a_bottom);
    
      if (isIn && !animation.enabled) {
        animation.enabled = true;
      }
      
      else if (!isIn && animation.enabled) {
        if (currentPos <= a_top) {
          applyStyles(id, styles, 0);
        } else if (currentPos >= a_bottom) {
          applyStyles(id, styles, 1);
        }
        animation.enabled = false;
      }
      
      if (animation.enabled) {
        const rate = easing((currentPos - a_top) / (a_bottom - a_top));
        applyStyles(id, styles, rate);
      }
    });
  }
  function onScroll() {
   
    const scrollTop = window.scrollY || window.pageYOffset;
    const currentPos = scrollTop + window.innerHeight / 2;
    
    disabled.forEach((obj, id) => {
      
      if (isAmong(currentPos, obj.top, obj.bottom)) {
        enabled.set(id, obj);
        elements[id].classList.remove("disabled");
        elements[id].classList.add("enabled");
        disabled.delete(id);
      }
    });
    
    enabled.forEach((obj, id) => {
      const { top, bottom, topStyle, bottomStyle } = obj;
      
      if (!isAmong(currentPos, top, bottom)) {
        
        if (currentPos <= top) {
          Object.entries(topStyle).forEach(([styleName, value]) => {
            applyStyle(elements[id], styleName, value);
          });
        }
        
        else if (currentPos >= bottom) {
          Object.entries(bottomStyle).forEach(([styleName, value]) => {
            applyStyle(elements[id], styleName, value);
          });
        }
        
        disabled.set(id, obj);
        elements[id].classList.remove("enabled");
        elements[id].classList.add("disabled");
        enabled.delete(id);
      }
     
      else {
        applyAnimations(currentPos, id);
      }
    });
  }