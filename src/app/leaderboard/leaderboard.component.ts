import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Player} from '../player';
import {DatabaseConnectorService} from '../database-connector.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit, AfterViewInit {
    players: Player[];
    bestPlayers: Player[];
    fiveBestPlayers: Player[];
    loading = true;
    error: any;
  constructor(private db: DatabaseConnectorService) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
      this.refreshPlayers(); 
  }
   
  private refreshPlayers () {
      this.db.getPlayers().subscribe((result: any) => {
          this.players = result?.data?.players;
          this.loading = result.loading;
          this.error = result.error;
          this.sortPlayers();
      })
  } 
  
  private sortPlayers() {
      this.bestPlayers = this.players.slice();
      this.bestPlayers.sort((a:Player, b:Player): number=>{
          return b.score - a.score;
      });
      this.fiveBestPlayers = this.bestPlayers.slice(0,5);
  }
  
}
