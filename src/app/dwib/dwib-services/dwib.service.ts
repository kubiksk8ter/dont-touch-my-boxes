import { Injectable } from '@angular/core';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { Subject, Subscription } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class DwibService {
    private renderer: Renderer2
    
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
    
    private gameloop: any;
    private gameloopIntervalTime: number = 1000;
    private isGameStarted: boolean = false;
    
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
           
    //ONMOUSEOVER ANIMATION SCRIPT
    //fill division with boxes
    fill() {
        this.createMainDiv();
        //div variables
        this.height = this.div.offsetHeight - 10;
        this.width = this.div.offsetWidth*0.95; if(this.width === 0){this.width = screen.width*0.95;}; 
                     
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
    
    //GAME   
    startGame() {
        if (!this.isGameStarted) {
            this.isGameStarted = true;                             
            this.gameloop = setInterval(()=>{
                this.highlightSimpleBox();
            }, this.gameloopIntervalTime);
            console.log("Game started!");
        }
        this.subscription = this.getScoreSubject().subscribe(data => {
            if (this.score <= 0) {
                this.stopGame();
            }
            switch (this.score) {
                case 3:
                    this.game(900);
                    break;
                case 6:
                    this.game(800);
                    break;
                case 10:
                    this.game(700);
                    break;
                case 15:
                    this.game(600);
                    break;
                case 21:
                    this.game(500);
                    break;
                case 30:
                    this.game(400);
                    break;
                case 35:
                    this.game(300);
                    break;
                case 40:
                    this.game(200);
                    break;
                case 45:
                    this.game(100);
                    break;
            }
        });      
    }
    private game(intervalTime: number) {
        this.gameloopIntervalTime = intervalTime;
        clearInterval(this.gameloop);
        this.gameloop = setInterval(()=>{
            this.highlightSimpleBox();
        }, this.gameloopIntervalTime);
        console.log(`Speed ${this.gameloopIntervalTime}`);
    } 
    
    stopGame() {
        if (this.isGameStarted) {
            this.isGameStarted = false;
            this.subscription.unsubscribe();
            clearInterval(this.gameloop);
            this.score = 0; this.updateScoreSubject(this.score);
            let coll = document.getElementsByClassName(`${this.innerBoxClassName}`);

            for (let i = 0; i < coll.length; i++) {
                //this.switchOffBox(coll[i]);                       
            }
            this.gameloopIntervalTime = 1000;
            console.log("Game over!");  
        }     
    }
    
    private highlightSimpleBox () {
        let isBoxClicked = false;
        let random = Math.floor(Math.random() * this.divNumber);                                   
        let element = document.getElementsByClassName(`${this.innerBoxClassName} X${random}`)[0];                          
        let animation = element.animate(
            [
                //keyframes
                {borderColor: "var(--border-color)"},
                {borderColor: "var(--scheme-color1)"},
                {borderColor: "var(--border-color)"}
            ],{
                duration: this.animationDuration            
            }
        );
        
        let onClickListener = this.renderer.listen(element, "click", ()=>{
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
    animateWave (waveAnimation: string) {
        for (let y = 0; y < this.coordinatesY; y++) {
            let coll = document.getElementsByClassName(`${this.innerBoxClassName} Y${y}`)
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
    */ 
}
