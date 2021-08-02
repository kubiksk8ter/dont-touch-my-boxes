import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import {DwibService} from '../dwib/dwib-services/dwib.service';

@Component({
  selector: 'app-dwib',
  templateUrl: './dwib.component.html',
  styleUrls: ['./dwib.component.css']
})
export class DwibComponent implements OnInit, AfterViewInit {  
    
  constructor(
    private renderer: Renderer2,
    private dwib: DwibService
  ) {}
   
  ngAfterViewInit(): void {
      this.preventDwibDefault();      
      this.dwib.fill();          
  }

  ngOnInit(): void {
                    
  }
  
  private preventDwibDefault() {
      this.renderer.listen(document.body, 'touchstart',(e: TouchEvent)=>{  
            e.preventDefault();        
      });
  }
    
}
