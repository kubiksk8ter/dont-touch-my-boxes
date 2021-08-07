import { Injectable } from '@angular/core';
import {Player} from '../app/player';
import {Apollo, gql} from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseConnectorService {
    private players: Player[];
    private bestPlayers: Player[];
    private loading = true;
    private error: any;
    private query = gql`
                query Query {
                  players {
                    id
                    name
                    score
                  }
                }`
  constructor(private apollo: Apollo) { }
  
  getPlayers() {
      return this.apollo.watchQuery({
          query: this.query
      }).valueChanges;
  }
  
  createPlayer(playerName: string, score: number) {
      return this.apollo.mutate({
          mutation: gql` mutation 
                {createPlayer(
                    name: "${playerName}",
                    score: ${score},
                    )
                { name, id }
            }`,
          refetchQueries: [{ query: this.query }]    
          })
  }
    
}
