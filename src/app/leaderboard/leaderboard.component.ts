import { Component, OnInit, AfterViewInit } from '@angular/core';
import {Player} from '../leaderboard/player';
import {Apollo, gql} from 'apollo-angular';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit, AfterViewInit {
    players: Player[];
    bestPlayers: Player[];
    loading = true;
    error: any;
  constructor(private appolo: Apollo) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
      this.refreshPlayers();
  }
    
  private refreshPlayers() {
      this.appolo.query({
          query: gql`
            query Query {
              players {
                id
                name
                score
              }
            }
          `,
          fetchPolicy: 'network-only'
      }).subscribe((result: any) => {
          this.players = result?.data?.players;
          this.loading = result.loading;
          this.error = result.error;
          this.sortPlayers();
      });
  }
  
  private sortPlayers() {
      this.bestPlayers = this.players.slice();
      this.bestPlayers.sort((a:Player, b:Player): number=>{
          return b.score - a.score;
      });
  }
}
