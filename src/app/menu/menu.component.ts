import { Component, OnInit } from '@angular/core';
import {DwibService} from '../dwib/dwib-services/dwib.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
    score: any = 0;

  constructor(
    private dwib: DwibService
  ) { }

  ngOnInit(): void {
      this.dwib.getScoreSubject().subscribe(data => {this.score = data});
  }
  
  start() {
    this.dwib.startGame();
  }
  stop() {
    this.dwib.stopGame();
  }

}
