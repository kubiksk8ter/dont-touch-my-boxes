import { Renderer2 } from '@angular/core';

export class DwibService {
    private height: number;
    private width: number;
    private padding: number;
    private innerBoxHeight: number;
    private innerBoxWidth: number;
    private div;
    private divId: string;
    private divClassName: string;
    private innerBox;
    private innerBoxId: string;
    private opacityStartPosition;
    private animationName;
    private animationDuration;
    private index: number;
    private divNumber = 0;
    private coordinatesY = 0;
    
    private gameloop: any;
    
  constructor(divId: string, innerBoxId:string, opacityStartPosition: number, padding: number, animationName: string, animationDuration: number, private renderer: Renderer2) {
        this.divId = divId;
        this.innerBoxId = innerBoxId;
        this.div = document.getElementById(this.divId);  //main element
        this.divClassName = this.div.getAttribute('class');
        this.innerBox = document.getElementById(this.innerBoxId);    //inner box element
        this.opacityStartPosition = opacityStartPosition;
        this.padding = padding;
        //div variables
        this.height = this.div.offsetHeight - 10;
        this.width = this.div.offsetWidth*0.95; if(this.width === 0){this.width = screen.width*0.95;};
        //inner box variables       
        this.innerBoxHeight = this.innerBox.offsetHeight;
        this.innerBoxWidth = this.innerBox.offsetWidth;
        //animation
        this.animationName = animationName;
        this.animationDuration = animationDuration;
    }
    //ONMOUSEOVER ANIMATION SCRIPT
    //fill division with boxes
    fill() {              
        if((document.getElementsByClassName(`${this.innerBoxId}`).length) < 2) {
            this.innerBox.remove();   
            for (let y:number = 0; y < this.height; y += this.innerBoxHeight + this.padding) {                
                for(let x:number = 0; x < this.width; x += this.innerBoxWidth + this.padding) {                           
                    const div = this.renderer.createElement('div');
                    this.renderer.setProperty(div, `id`, `${this.innerBoxId}`);
                    this.renderer.setAttribute(div, 'class', `${this.innerBoxId} X${this.divNumber} Y${this.coordinatesY}`)
                    this.renderer.appendChild(this.div, div);
                    this.renderer.setStyle(div,'top',`${y}px`);
                    this.renderer.setStyle(div, 'left', `${x}px`);
                    this.renderer.setStyle(div,'opacity', `${this.opacity(x,this.width)}`)
                    
                    /*on mouse over animation*/
                    this.renderer.listen(div, 'mouseover', () => {                   
                        this.renderer.addClass(div, this.animationName);
                        setTimeout(() => {
                            this.renderer.removeClass(div, this.animationName);
                        }, this.animationDuration);                   
                    });
                    
                    /*on touchover animation*/                   
                    this.renderer.listen(div, 'touchmove',(e: TouchEvent)=>{                   
                        var touchX = e.touches[0].clientX;
                        var touchY = e.touches[0].clientY;                             
                        var touchedElement = document.elementFromPoint(Math.floor(touchX), Math.floor(touchY));
                        //test document.getElementById("test").innerHTML = `x: ${Math.floor(touchX)}, y: ${Math.floor(touchY)}, Id: ${touchedElement.getAttribute("id")}`;          
                        if(touchedElement.getAttribute("id") === this.innerBoxId) {
                            this.renderer.addClass(touchedElement, this.animationName);
                            setTimeout(() => {
                                this.renderer.removeClass(touchedElement, this.animationName);                               
                            }, this.animationDuration);
                        }                                  
                    });
                    this.divNumber++;                          
                }
                this.coordinatesY++;                         
            } 
        }       
    }
    
    private opacity(x: number, width: number): number {
        const startPos: number = this.opacityStartPosition * width;
        var opacity: number = (width - x) / (width - startPos);
        return opacity;
    }
    
    removeInnerBoxes() {
        /*
        for (let i = 0; i <= document.getElementById(this.divId).childNodes.length * 100; i++) {
            document.getElementById(this.innerBoxId).remove()
        }
        var mainDiv = document.getElementById(this.divId);
        var innerBox = this.renderer.createElement('div');
        this.renderer.setAttribute(innerBox, 'id', this.innerBoxId);
        this.renderer.appendChild(mainDiv, innerBox);
        */
               
        let superMain = document.getElementById(this.divId).parentElement;
        superMain.removeChild(document.getElementById(this.divId));
        
        let mainDiv = this.renderer.createElement('div');
        let innerBox = this.renderer.createElement('div');
        this.renderer.setAttribute(mainDiv, 'id', this.divId);
        this.renderer.setAttribute(innerBox, 'id', this.innerBoxId);
        
        superMain.appendChild(mainDiv);
        this.renderer.appendChild(mainDiv, innerBox);               
    }
    
    //  ANIMATIONS
    animateLines (animationName: string) {        
        if(animationName === null) {
            animationName = this.animationName;
        }
        let coll = document.getElementsByClassName(`${this.innerBoxId}`);       
        for (let i = 0; i < coll.length; i++) {
            
            setTimeout(()=>{
                if(typeof coll[i] !== 'undefined') {               
                    this.renderer.addClass(coll[i], animationName);
                }
                setTimeout(()=>{
                    if(typeof coll[i] !== 'undefined') { 
                        this.renderer.removeClass(coll[i], animationName);
                    }
                }, this.animationDuration);                              
            }, i*20);                       
        }       
    }
    animateWave (waveAnimation: string) {
        for (let y = 0; y < this.coordinatesY; y++) {
            let coll = document.getElementsByClassName(`${this.innerBoxId} Y${y}`)
            for (let x = 0; x < coll.length; x++) {
                setTimeout(()=>{
                    if(typeof coll[x] !== 'undefined') {
                        this.renderer.addClass(coll[x], waveAnimation);
                    }
                    setTimeout(()=>{
                        if(typeof coll[x] !== 'undefined') {
                            this.renderer.removeClass(coll[x], waveAnimation);
                        }
                    }, this.animationDuration);
                }, x*20);
            }
        }
    }
    highlightSimpleBoxes (randomAnimation: string) {
        let random;
        console.log("Game started!");
               
        this.gameloop = setInterval(()=>{
                       
            setTimeout(()=>{
                random = Math.floor(Math.random() * this.divNumber);
                let element = document.getElementsByClassName(`${this.innerBoxId} X${random}`)[0];                          
                this.renderer.addClass(element, randomAnimation);               
                
                setTimeout(()=>{
                    this.renderer.removeClass(element, randomAnimation);
                }, this.animationDuration);
                
            }, 1000);
                      
        }, 1000);
    }
    stopGame() {
        clearInterval(this.gameloop);
        console.log("Game stoped!")
    }
}

