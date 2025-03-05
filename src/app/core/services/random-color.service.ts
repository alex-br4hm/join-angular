import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomColorService {
  lastHue: number = Math.floor(Math.random() * 360);

  getColor(): string {
    this.lastHue             = (this.lastHue + 137) % 360;
    const saturation: number = Math.floor(Math.random() * 20) + 60;
    const lightness: number  = Math.floor(Math.random() * 20) + 25;
    return `hsl(${this.lastHue}, ${saturation}%, ${lightness}%)`;
  }
}
