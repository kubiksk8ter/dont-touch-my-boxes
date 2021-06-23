import { Injectable, ElementRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppElementsService {
    dwibElement: HTMLElement = null;

  constructor() { }
  
  setDwibElement(element: HTMLElement) {
      this.dwibElement = element;
  }
  get DwibElement() {
      return this.dwibElement;
  }
}
