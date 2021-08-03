import { Component, OnInit, AfterViewInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import {DwibService} from '../dwib/dwib-services/dwib.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, AfterViewInit {
    score: any = 0;
    @ViewChild('outputEl') private outputEl: ElementRef;
    output: string = "Welcome!";

  constructor(
    private dwib: DwibService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
      this.dwib.getScoreSubject().subscribe(data => {this.score = data});
  }
  ngAfterViewInit():void {
      this.dwib.getOutputSubject().subscribe(data => {
          this.output = data; 
          if(data == "Game Over!" || data == "Avoid red boxes!") {
              this.setOutputColor("var(--scheme-color1)");
          }
          else {
              this.setOutputColor("var(--scheme-color2)");
          }
      });
  }
  
  start() {
      this.dwib.startGame();
  }
  stop() {
      this.dwib.stopGame();
  }
  private setOutputColor(color: string) {
      this.renderer.setStyle(this.outputEl.nativeElement, "color", color);
  }

}
