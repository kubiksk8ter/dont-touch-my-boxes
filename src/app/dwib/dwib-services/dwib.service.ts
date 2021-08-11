import { Injectable } from '@angular/core';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { Subject, Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class DwibService {
    private renderer: Renderer2
    //DWIB variables
    private height: number;
    private width: number;
    private padding: number = 1;
    private innerBoxHeight: number = 38;
    private innerBoxWidth: number = 38;
    private div: any;
    private innerBoxClassName: string = 'inner-box';
    private opacityStartPosition: number = 1;
    private animationDuration: number = 2500;
    private index: number;
    private divNumber = 0;
    private coordinatesY = 0;
    //GAME variables
    private gameloop: any;
    private gameloopIntervalTime: number = 1000;
    private isGameStarted: boolean = false;
    private isGreenBoxesReady: boolean = false;
    //SCORE variables
    private score: number = 0;
    private scoreSubject = new Subject<number>();
    private subscription: Subscription;
    private scoreSubject$ = this.scoreSubject.asObservable();
    private updateScoreSubject(newScore: number) {
        this.scoreSubject.next(newScore);
    }
    getScoreSubject() {
        return this.scoreSubject$;
    }
    //Green SCORE variables
    private greenScore: number = 0;
    private greenScoreSubject = new Subject<number>();
    private greenScoreSubject$ = this.greenScoreSubject.asObservable();
    private updateGreenScoreSubject(newScore: number) {
        this.greenScoreSubject.next(newScore);
    }
    getGreenScoreSubject() {
        return this.greenScoreSubject$;
    }   
    //OUTPUT variables    
    private output: string = "Welcome!";
    private outputSubject = new Subject<string>();
    private outputSubject$ = this.outputSubject.asObservable();
    private updateOutputSubject(newOutput: string) {
        this.outputSubject.next(newOutput);
    }
    getOutputSubject() {
        return this.outputSubject$;
    }
    //END-GAME VARIABLES
    private isGameEnded: boolean = false;
    private isGameEndedSubject = new Subject<boolean>();
    private isGameEndedSubject$ = this.isGameEndedSubject.asObservable();
    private updateIsGameEndedSubject(isGameEnded: boolean) {
        this.isGameEndedSubject.next(isGameEnded);
    }
    getIsGameEndedSubject() {
        return this.isGameEndedSubject$;
    }
    
       
    constructor(rendererFactory: RendererFactory2) {
        this.renderer = rendererFactory.createRenderer(null, null);             
    }
    
    private createMainDiv() {
        this.div = this.renderer.createElement("div");
        this.renderer.setProperty(this.div, "id", "rottating-boxes");
        this.renderer.setAttribute(this.div, "style", 
       `position: absolute;    
        display: flex;
        margin-left: auto;
        margin-right: auto;
        margin-top: auto;
        margin-bottom: auto;
        left: 0;
        right: 0;      
        top: 0;
        bottom: 0;
       `
        )
        let windowWidth = window.innerWidth - 30;
        let windowHeight = window.innerHeight - 30;

        if(windowWidth > windowHeight) {
            this.renderer.setStyle(this.div, 'width', `${windowHeight}px`);
            this.renderer.setStyle(this.div, 'height', `${windowHeight}px`);
        }
        else {
            this.renderer.setStyle(this.div, 'width', `${windowWidth}px`);
            this.renderer.setStyle(this.div, 'height', `${windowWidth}px`);
        }
        this.renderer.appendChild(document.body, this.div);
    } 
           
    //fill division with boxes
    fill() {
        this.createMainDiv();
        //div variables
        this.height = this.div.offsetHeight - 20;
        this.width = this.div.offsetWidth*0.90; if(this.width === 0){this.width = screen.width*0.95;}; 
                     
        if((document.getElementsByClassName(`${this.innerBoxClassName}`).length) < 2) {   
            for (let y:number = 0; y < this.height; y += this.innerBoxHeight + this.padding) {                
                for(let x:number = 0; x < this.width; x += this.innerBoxWidth + this.padding) {                           
                    const div = this.renderer.createElement('div');
                    this.renderer.setProperty(div, `id`, `${this.innerBoxClassName}`);
                    this.renderer.setAttribute(div, 'class', `${this.innerBoxClassName} X${this.divNumber} Y${this.coordinatesY}`)
                    this.renderer.setAttribute(div, "style", 
                        `position: absolute;
                         width: ${this.innerBoxWidth}px;
                         height: ${this.innerBoxHeight}px;
                         top: ${y}px;
                         left: ${x}px;
                         border: 1px solid var(--border-color);
                         border-radius: 5px;
                        `                   
                    )
                    this.renderer.appendChild(this.div, div);                                       
                    this.divNumber++;                          
                }
                this.coordinatesY++;                         
            } 
        }       
    }   
    //GAME 
    private changeSpeed(intervalTime: number, simpleBoxes: boolean, negativeBoxes: boolean, greenBoxes: boolean) {
        this.gameloopIntervalTime = intervalTime;
        clearInterval(this.gameloop);
        this.gameloop = setInterval(()=>{
            if (simpleBoxes) {this.highlightSimpleBox();};
            if (negativeBoxes) {this.highlightNegativeBox()};
            if (greenBoxes) {this.highlightGreenBox(), this.isGreenBoxesReady = true};           
        }, this.gameloopIntervalTime);
        
        this.updateOutputSubject(`Speed ${(1000 / this.gameloopIntervalTime).toFixed(1)}x`);
    }
      
    startGame() {
        if (!this.isGameStarted) {
            this.isGameStarted = true; this.isGameEnded = false; this.updateIsGameEndedSubject(this.isGameEnded);
            this.greenScore = 0; this.updateGreenScoreSubject(this.greenScore); 
            this.score = 0; this.updateScoreSubject(this.score); 
            this.isGreenBoxesReady = false;
                                       
            this.gameloop = setInterval(()=>{
                this.highlightSimpleBox();
            }, this.gameloopIntervalTime);
            if (this.isTouchEnabled()) {this.updateOutputSubject("Hit yellow boxes!")}
            else {this.updateOutputSubject("Hover yellow boxes!")};
        }
        this.subscription = this.getScoreSubject().subscribe(data => {
            if (this.score <= 0) {
                this.stopGame();
            }
            if (!this.isGreenBoxesReady) {
            switch (this.score) {
                case 3:
                    this.changeSpeed(900, true, false, false);
                    break;
                case 6:
                    this.changeSpeed(800, true, false, false);
                    break;
                case 10:
                    this.changeSpeed(700, true, false, false);
                    break;
                case 15:
                    this.changeSpeed(600, true, false, false);
                    break;
                case 21:
                    this.changeSpeed(500, true, false, false);
                    break;
                case 30:
                    this.changeSpeed(400, true, true, false);
                    this.updateOutputSubject("Avoid red boxes!");
                    break;
                case 40:
                    this.changeSpeed(300, true, true, false);
                    break;
                case 50:
                    this.changeSpeed(200, true, true, true);
                    this.updateOutputSubject("Hit green boxes!!!");
                    break;
            }}
        });      
    }
     
    stopGame() {
        if (this.isGameStarted) {
            this.isGameStarted = false; this.isGameEnded = true; this.updateIsGameEndedSubject(this.isGameEnded);
            this.subscription.unsubscribe();
            clearInterval(this.gameloop);
            this.score = 0; this.updateScoreSubject(this.score);           
            this.gameloopIntervalTime = 1000;
            this.animateWave();
            
            this.updateOutputSubject("Game Over!");  
        }     
    }
    
    private highlightSimpleBox () {
        let isBoxClicked = false;
        let random = Math.floor(Math.random() * this.divNumber);                                   
        let element = document.getElementsByClassName(`${this.innerBoxClassName} X${random}`)[0];                          
        let animation = element.animate(
            [   //keyframes
                {borderColor: "var(--border-color)"},
                {borderColor: "var(--scheme-color2)"},
                {borderColor: "var(--border-color)"}
            ],{
                duration: this.animationDuration            
            }
        );
        
        let onClickListener = this.renderer.listen(element, this.clickOrHover(), ()=>{
            this.score += 1; this.updateScoreSubject(this.score);
            isBoxClicked = true;           
            onClickListener();
            animation.cancel();
        });               
                
        setTimeout(()=>{
            animation.cancel();
            onClickListener();
            ;
            if (!isBoxClicked && this.isGameStarted){
                this.score -= 1; this.updateScoreSubject(this.score);
            }
        }, this.animationDuration);
    }
    
    private highlightNegativeBox () {
        let random = Math.floor(Math.random() * this.divNumber);                                   
        let element = document.getElementsByClassName(`${this.innerBoxClassName} X${random}`)[0];                          
        let animation = element.animate(
            [   //keyframes
                {borderColor: "var(--border-color)"},
                {borderColor: "var(--scheme-color1)"},
                {borderColor: "var(--border-color)"}
            ],{
                duration: this.animationDuration            
            }
        );
        
        let onClickListener = this.renderer.listen(element, this.clickOrHover(), ()=>{
            this.score -= 5; this.updateScoreSubject(this.score);           
            onClickListener();
            animation.cancel();
        });               
                
        setTimeout(()=>{
            animation.cancel();
            onClickListener();
            ;
        }, this.animationDuration);
    }
    
    private highlightGreenBox () {
        let random = Math.floor(Math.random() * this.divNumber);                                   
        let element = document.getElementsByClassName(`${this.innerBoxClassName} X${random}`)[0];                          
        let animation = element.animate(
            [   //keyframes
                {borderColor: "var(--border-color)"},
                {borderColor: "var(--scheme-color3)"},
                {borderColor: "var(--border-color)"}
            ],{
                duration: this.animationDuration/2           
            }
        );
        
        let onClickListener = this.renderer.listen(element, this.clickOrHover(), ()=>{
            this.greenScore += 1; this.updateGreenScoreSubject(this.greenScore);           
            onClickListener();
            animation.cancel();
        });               
                
        setTimeout(()=>{
            animation.cancel();
            onClickListener();
            ;
        }, this.animationDuration/2);
    }
    
    private animateWave () {
        for (let y = 0; y < this.coordinatesY; y++) {
            let coll = document.getElementsByClassName(`${this.innerBoxClassName} Y${y}`)
            for (let x = 0; x < coll.length; x++) {
                setTimeout(()=>{
                    if(typeof coll[x] !== 'undefined') {
                        let animation = coll[x].animate(
                            [   //keyframes
                                {borderColor: "var(--border-color)"},
                                {borderColor: "var(--scheme-color1)"},
                                {borderColor: "var(--border-color)"}
                            ],{
                                duration: this.animationDuration            
                            }
                        );
                    }
                }, x*20);
            }
        }
    }
    
    private isTouchEnabled() {
        return ( 'ontouchstart' in window ) || 
               ( navigator.maxTouchPoints > 0 ) ||
               ( navigator.msMaxTouchPoints > 0 );
    }
    
    private clickOrHover() {
        if (this.isTouchEnabled()) {return "click";} else {return "mouseover";}
    }
    
    /*
    private opacity(x: number, width: number): number {
        const startPos: number = this.opacityStartPosition * width;
        var opacity: number = (width - x) / (width - startPos);
        return opacity;
    }
    */
    
    /**  ANIMATIONS
    animateLines () {        
        if(animationName === null) {
            animationName = this.animationName;
        }
        let coll = document.getElementsByClassName(`${this.innerBoxClassName}`);       
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
    */
    
    /*on mouse over animation
                    this.renderer.listen(div, 'mouseover', () => {                   
                        let animation = div.animate(
                            [
                                //keyframes
                                {borderColor: "var(--border-color)"},
                                {borderColor: "var(--scheme-color1)"},
                                {borderColor: "var(--border-color)"}
                            ],{
                                duration: this.animationDuration
                            }
                        );                   
                    });
                    */
                    
    /*on touchover animation                   
                    this.renderer.listen(div, 'touchmove',(e: TouchEvent)=>{                   
                        var touchX = e.touches[0].clientX;
                        var touchY = e.touches[0].clientY;                             
                        var touchedElement = document.elementFromPoint(Math.floor(touchX), Math.floor(touchY));
                        //test 
                        //document.getElementById("test").innerHTML = `x: ${Math.floor(touchX)}, y: ${Math.floor(touchY)}, Id: ${touchedElement.getAttribute("class")}`;          
                        //if(touchedElement.getAttribute("class") === `${this.innerBoxClassName} X${this.divNumber} Y${this.coordinatesY}`) {
                            let animation = touchedElement.animate(
                                [
                                    //keyframes
                                    {borderColor: "var(--border-color)"},
                                    {borderColor: "var(--scheme-color1)"},
                                    {borderColor: "var(--border-color)"}
                                ],{
                                    duration: this.animationDuration
                                }
                            );
                        //}                                  
                    });
                    */ 
}
