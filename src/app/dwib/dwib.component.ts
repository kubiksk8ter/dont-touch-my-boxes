import { Component, OnInit, AfterViewInit, Renderer2, ViewChild, ElementRef, HostListener } from '@angular/core';
import {DwibService} from '../dwib/dwib-services/dwib.service';
import {AppElementsService} from '../app-elements.service';

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
   
  constructor(
    private renderer: Renderer2
  ) {}
   
  ngAfterViewInit(): void {
      this.preventDwibDefault(); 
      this.setDwibSize();
      this.dwib = new DwibService('rotating-boxes', 'inner-box', 1, 1, 'dwibAnimation2', 2500, this.renderer);
      this.dwib.fill(); 
      this.getScore();             
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
      this.dwib.startGame("dwibAnimation1");
  }
  stop() {
      this.dwib.stopGame();
  }
  async getScore() {
      this.dwib.getScore() ;    
  }
  
}
