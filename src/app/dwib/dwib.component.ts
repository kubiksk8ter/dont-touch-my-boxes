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
    
  constructor(
    private renderer: Renderer2
  ) {}
   
  ngAfterViewInit(): void {
      this.preventDwibDefault();    
  }

  ngOnInit(): void {
      this.dwib = new DwibService('rotating-boxes', 'inner-box', 1, 1, 'dwibAnimation2', 2500, this.renderer);
      this.dwib.fill();                
  }
  
  private preventDwibDefault() {
      this.renderer.listen(this.dwibElement.nativeElement, 'touchstart',(e: TouchEvent)=>{  
            e.preventDefault();        
      });
  }
  
  @HostListener('window:resize')
    onResize() {
        this.dwib.removeInnerBoxes();
        setTimeout(()=>{       
            this.dwib = new DwibService('rotating-boxes', 'inner-box', 1, 1, 'dwibAnimation2', 2500, this.renderer);
            this.dwib.fill();
            this.preventDwibDefault();
        }, 200);                
    }

}
