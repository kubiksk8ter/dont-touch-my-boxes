import { Component, OnInit, Renderer2, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators} from '@angular/forms';
import {DatabaseConnectorService} from '../database-connector.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {
    @ViewChild('formEl') private formElement: ElementRef;
    
    score = 58;
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
              private renderer: Renderer2) { }

  ngOnInit(): void {
  }
  
  ngAfterViewInit(): void {
      
  }
  
  onSubmit() {
      this.createPlayer();
  }
    
  get name() {return this.form.get('name')}
  
  private createPlayer() {
      this.db.createPlayer(this.name.value, this.score).subscribe((result: any) => {
        console.log(`Player ${this.name.value} succsessfully added to leaderboard!`)
      });
  }
  
  closeForm() {
      this.renderer.setStyle(this.formElement.nativeElement, "visibility", "hidden");
  }
}
