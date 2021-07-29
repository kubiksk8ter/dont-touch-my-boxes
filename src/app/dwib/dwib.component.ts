import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import {DwibService} from '../dwib/dwib-services/dwib.service';

@Component({
  selector: 'app-dwib',
  templateUrl: './dwib.component.html',
  styleUrls: ['./dwib.component.css']
})
export class DwibComponent implements OnInit, AfterViewInit {
    private dwib: DwibService;
    @ViewChild('mainDwib', { read: ElementRef }) private dwibElement: ElementRef;
    @ViewChild('rotatingBoxes') private rotatingBoxes: ElementRef;
    @ViewChild('startBtn') private startBtn: ElementRef;
    
    score: any = 0;
    isGameStarted = false;
    
  constructor(
    private renderer: Renderer2
  ) {}
   
  ngAfterViewInit(): void {
      this.preventDwibDefault(); 
      this.setDwibSize();
      this.dwib = new DwibService('rotating-boxes', 'inner-box', 1, 1, 'dwibAnimation2', 2500, this.renderer);
      this.dwib.fill(); 
      this.dwib.getScoreSubject().subscribe(data => {this.score = data});          
  }

  ngOnInit(): void {
                    
  }
  
  private preventDwibDefault() {
      this.renderer.listen(this.dwibElement.nativeElement, 'touchstart',(e: TouchEvent)=>{  
            e.preventDefault();        
      });
  }
  
  private setDwibSize() {
      let windowWidth = window.innerWidth - 30;
      let windowHeight = window.innerHeight - 30;
      
      if(windowWidth > windowHeight) {
          this.renderer.setStyle(this.rotatingBoxes.nativeElement, 'width', `${windowHeight}px`);
          this.renderer.setStyle(this.rotatingBoxes.nativeElement, 'height', `${windowHeight}px`);
      }
      else {
          this.renderer.setStyle(this.rotatingBoxes.nativeElement, 'width', `${windowWidth}px`);
          this.renderer.setStyle(this.rotatingBoxes.nativeElement, 'height', `${windowWidth}px`);
      }
  }
  
  start() {
      if (!this.isGameStarted){
        this.isGameStarted = true;
        this.dwib.startGame("dwibAnimation1");
      }
  }
  stop() {
      this.isGameStarted = false;
      this.dwib.stopGame();
  }  
}
