import { Component, OnInit, Renderer2 } from '@angular/core';
import {DwibService} from '../dwib/dwib-services/dwib.service';

@Component({
  selector: 'app-dwib',
  templateUrl: './dwib.component.html',
  styleUrls: ['./dwib.component.css']
})
export class DwibComponent implements OnInit {
    private dwib: DwibService;

  constructor(
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
      this.dwib = new DwibService('rotating-boxes', 'inner-box', 1, 1, 'dwibAnimation2', 2500, this.renderer);
      this.dwib.fill();   
  }

}
