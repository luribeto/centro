
/***ZEMOGA Z-Test 
@Author: Leonardo Uribe;
@Date: 03/08/2016
@Description: The Object to create the slider, was built in Vanilla JS as required in the specs document.
NO framekorks or libraries used (jQuery, Angular, Bootstrap, etc..).
The javaScript code was wrote as a pseudoclassical pattern, using prototype chains to save memory with the .__proto__ object. Even the exercise used only one slider, the code is presented to be optimized in case of several sliders needed.
***/
var Slider = function()
{
    //Slider parent object
    this.sld              = document.getElementById('slider');
    //Images wrapper
    this.sldWrapper       = document.getElementById('sld-wrapper');
    //Arrows parent Object
    this.sldControls      = document.getElementById('sld-controls');
    //Back arrow parent object
    this.sldPrev          = document.getElementById('sld-prev');
    //Next arrow parent object
    this.sldNext          = document.getElementById('sld-next');
    //Images elements inside slider
    this.sldImages        = this.sldWrapper.getElementsByTagName('img');
    //Number of images to include
    this.sldFrames        = this.sldImages.length;
    //Selected image ratio to diplay
    this.sldRatio         = "2.75:1";
    //Current Image displayed
    this.sldCurrentImg    = 0;
    //Slider width
    this.sldWidth         = 0;
    //Slider Height
    this.sldHeight        = 0;
};

/**@Methods:
build: Manage all the thread to create the slider;
getRatioPercent: Sets the ratio percent to set the slider and wraper;
getSldDimensions: Sets the slider Width and height according with offsetHeight and offsetWidth;
setDimensions: Sets paddingBottom of slider and wrapper elements according with rario percent;
coverImages: Sets the proper styles to coverr all the area;
calculateCentre: Sets the images positioning;
addCurrent: Sets the proper class to the current image;
prevClick: Call functions necesary to display previous image;
nextClick: Call functions necesary to display upcoming image;
clearCurrent: Removes current class;
goToFrame: Function to display previous or upcoming image;
windowResize: Call functions necesary to display slider on resize event;
**/
Slider.prototype = {
    build: function(){
        this.getRatioPercent();
        this.setDimensions();
        this.getSldDimensions();

        for(var i = 0, l = this.sldImages.length; i < l; i++) {
            this.coverImages(this.sldImages[i]);
        }

        this.addCurrent(0);

        // Next and Prev click handlers
        if(window.addEventListener) {
            this.sldPrev.addEventListener('click', this.prevClick.bind(this));
            this.sldNext.addEventListener('click', this.nextClick.bind(this));
        } else if(window.attachEvent) {
            this.sldPrev.attachEvent('onclick', this.prevClick);
            this.sldNext.attachEvent('onclick', this.nextClick);
        }

        //Add keyboard arrows events
        document.onkeydown = function(e) {
            evt = e || window.event;
            switch(evt.keyCode) {
                case 37:
                    this.prevClick();
                    break;
                case 39:
                    this.nextClick();
                    break;
            }
        };

        // Recalculate image centres on window resize
        if(window.addEventListener) {
            window.addEventListener('resize', this.windowResize.bind(this));
        } else if(window.attachEvent) {
            window.attachEvent('onresize', this.windowResize.bind(this));
        }

    },
    getRatioPercent: function(){
        var ratioSplit = this.sldRatio.split(':');
        this.ratioPercent = ratioSplit[1] / ratioSplit[0] * 100;
    },
    getSldDimensions: function(){
        this.sldWidth  = this.sldWrapper.offsetWidth;
        this.sldHeight = this.sldWrapper.offsetHeight;
    },
    setDimensions: function(){
        this.sld.style.paddingBottom = this.sldWrapper.style.paddingBottom = this.ratioPercent + '%';
    },
    coverImages: function(imgEl){
        var img = new Image();
        img.src = imgEl.src;

        var thisObj = this;
        var wait = setInterval(function(){
            if(img.width != 0 && img.height != 0) {
                clearInterval(wait);

                // Stretch to fit
                if((img.width / img.height) < (thisObj.sldWidth / thisObj.sldHeight)) {
                    imgEl.className += ' full-width';
                } else {
                    imgEl.className += ' full-height';
                }

                thisObj.calculateCentre();
            }
        }, 0);
    },
    calculateCentre: function() {
        for(var i = 0, l = this.sldImages.length; i < l; i++) {
            if(this.sldImages[i].width >= this.sldWidth) {
                this.sldImages[i].style.left = (this.sldWidth - this.sldImages[i].width) / 2 + 'px';
            }

            if(this.sldImages[i].height >= this.sldHeight) {
                this.sldImages[i].style.top = (this.sldHeight - this.sldImages[i].height) / 2 + 'px';
            }
        }
    },
    addCurrent: function(n) {
        this.sldImages[n].className += ' current';
    },
    prevClick: function() {
        this.clearCurrent();
        this.goToFrame(this.sldCurrentImg - 1);
        this.addCurrent(this.sldCurrentImg);
    },
    nextClick: function() {
        this.clearCurrent();
        this.goToFrame(this.sldCurrentImg + 1);
        this.addCurrent(this.sldCurrentImg);
    },
    clearCurrent: function() {
        for(var i = 0; i < this.sldFrames; i++) {
            this.sldImages[i].className = this.sldImages[i].className.replace(/ current/, '');
        }
    },
    goToFrame: function(n) {
        if(n >= this.sldFrames) {
            this.sldCurrentImg = 0;
        } else if(n < 0) {
            this.sldCurrentImg = this.sldFrames - 1;
        } else {
            this.sldCurrentImg = n;
        }
    },
    windowResize: function() {
        this.getSldDimensions();
        this.calculateCentre();
    }
};

(function(){
    var sld = new Slider();
    sld.build();
})();
