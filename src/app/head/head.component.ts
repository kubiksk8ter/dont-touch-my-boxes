import { Component, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild, HostListener } from '@angular/core';

@Component({
  selector: 'app-head',
  templateUrl: './head.component.html',
  styleUrls: ['./head.component.css']
})
export class HeadComponent implements OnInit, AfterViewInit {   
    @ViewChild('leftEye') private leftEye: ElementRef;
    @ViewChild('rightEye') private rightEye: ElementRef;
    @ViewChild('leftEyeBrow') private leftEyeBrow: ElementRef;
    @ViewChild('rightEyeBrow') private rightEyeBrow: ElementRef;
    @ViewChild('nose') private nose: ElementRef;
    @ViewChild('mouth') private mouth: ElementRef;
    
    private windowWidth: number = 0;
    private windowHeight: number = 0;
    private clientX: number = 0;
    private clientY: number = 0;
    
    private bodyElement: HTMLElement = document.body;
    private dwib: HTMLElement;
    
    @HostListener('window:resize')
    onResize() {
      this.setWindowSize();              
    }
    
  constructor(
    private renderer: Renderer2
  ) { }

  ngOnInit(): void { }
  
  ngAfterViewInit(): void {
      this.setClientPosition();     
      this.setWindowSize();
  }
  
  private setWindowSize() {
      this.windowWidth = window.innerWidth;
      this.windowHeight = window.innerHeight;
      this.renderer.listen(this.bodyElement, 'mousemove', ()=>{
          this.watchCursor();
      }); 
      this.renderer.listen(this.bodyElement, 'touchmove', ()=>{
          this.watchCursor();
      });
  }
  
  private setClientPosition() {
       
      this.renderer.listen(this.bodyElement, 'mousemove', (e: MouseEvent)=>{ 
          this.clientX = e.clientX;
          this.clientY = e.clientY;
      });   
      this.renderer.listen(this.bodyElement, 'touchmove', (e: TouchEvent)=>{
          this.clientX = e.touches[0].clientX;
          this.clientY = e.touches[0].clientY;
      });                           
  }
  
  private watchCursor() {
      //left eye
          this.renderer.setAttribute(this.leftEye.nativeElement, 'cx' , `${
              4+((this.clientX/ this.windowWidth)*4)
          }`);
          this.renderer.setAttribute(this.leftEye.nativeElement, 'cy' , `${
              5+(-((this.windowHeight / 2) - this.clientY)/230)
          }`);
          //right eye
          this.renderer.setAttribute(this.rightEye.nativeElement, 'cx' , `${
              14+((this.clientX/ this.windowWidth)*4)
          }`);
          this.renderer.setAttribute(this.rightEye.nativeElement, 'cy' , `${
              5+(-((this.windowHeight / 2) - this.clientY)/230)
          }`);
          //left eye brow
          this.renderer.setAttribute(this.leftEyeBrow.nativeElement, 'd' , 
          `M ${3} 
             ${2*(1+(this.clientY/this.windowHeight))} 
           C ${5} 
             ${4}
             ${7}
             ${2*(1+(this.clientY/this.windowHeight))}
             ${9}
             ${3*(1+(this.clientY/this.windowHeight))}`
          );
          //right eye brow
          this.renderer.setAttribute(this.rightEyeBrow.nativeElement, 'd' , 
          `M ${13} 
             ${3*(1+(this.clientY/this.windowHeight))}
           C ${15}
             ${2*(1+(this.clientY/this.windowHeight))}
             ${17}
             ${4}
             ${19}
             ${2*(1+(this.clientY/this.windowHeight))}`
          );
          //nose
          this.renderer.setAttribute(this.nose.nativeElement, 'd' , 
          `M ${10+(this.clientX/ this.windowWidth)*2} 
             ${9+(1+(this.clientY/this.windowHeight))}
           C ${8+((this.clientX/ this.windowWidth)*6)}
             ${9+(1+(this.clientY/this.windowHeight))}
             ${8+((this.clientX/ this.windowWidth)*6)}
             ${9+(1+(this.clientY/this.windowHeight))}
             ${10+(this.clientX/ this.windowWidth)*2}
             ${7+(1+(this.clientY/this.windowHeight))}`
          );
          //mouth
          this.renderer.setAttribute(this.mouth.nativeElement, 'd' , 
          `M ${10-(this.clientX/ this.windowWidth)} 
             ${16-(this.clientX/ this.windowWidth)}
           C ${11-(this.clientX/ this.windowWidth)}
             ${15}
             ${12-(this.clientX/ this.windowWidth)}
             ${15}
             ${14-(this.clientX/ this.windowWidth)}
             ${15+(this.clientX/ this.windowWidth)}`
          );
  }
   
}
