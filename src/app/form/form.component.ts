import { Component, OnInit, Renderer2, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import {DatabaseConnectorService} from '../database-connector.service';
import {DwibService} from '../dwib/dwib-services/dwib.service';
import {Player} from '../player';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements AfterViewInit {
    @ViewChild('formEl') private formElement: ElementRef;
    private players: Player[];
    private fiveBestPlayers: Player[];
    score: number;
    form = this.fb.group({
        name: ['', [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(5),
            Validators.pattern(/^[a-zA-Z' ]+$/)
        ]]
    });

  constructor(private fb: FormBuilder, 
              private db: DatabaseConnectorService, 
              private renderer: Renderer2,
              private dwib: DwibService) { }

  ngAfterViewInit(): void {
      this.showForm();
      this.getScore();
      this.getFiveBestPlayers();
  }
  
  onSubmit() {
      this.createPlayer();
      this.renderer.setStyle(this.formElement.nativeElement, 'visibility', 'hidden');
  }
  
  closeForm() {
      this.renderer.setStyle(this.formElement.nativeElement, "visibility", "hidden");
  }
  
  private createPlayer() {
      this.db.createPlayer(this.name.value, this.score).subscribe((result: any) => {
        console.log(`Player ${this.name.value} succsessfully added to leaderboard!`)
      });
  } 
  get name() {return this.form.get('name')}
  
  private showForm() {
      this.dwib.getIsGameEndedSubject().subscribe(data => {          
          if ((data == true) && this.isScoreBest()) {
              this.renderer.setStyle(this.formElement.nativeElement, 'visibility', 'visible');             
          }
      });
  }
  
  private getScore() {
      this.dwib.getGreenScoreSubject().subscribe(data => {
          this.score = data;             
      });
  }
  
  private isScoreBest(): boolean {
      let isScoreBest = false;
      for (let player of this.fiveBestPlayers) {
          if (this.score > player.score) {
              isScoreBest = true;
          }
      }
      return isScoreBest;
  }
  
  private getFiveBestPlayers() {
      this.db.getPlayers().subscribe((result: any) => {
          this.players = result?.data?.players;
          this.fiveBestPlayers = this.players.slice();
          this.fiveBestPlayers.sort((a:Player, b:Player): number=>{
              return b.score - a.score;
          });
          this.fiveBestPlayers = this.fiveBestPlayers.slice(0,5);        
      });
  }
}
