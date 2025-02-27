import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RandomColorService {
  private colorCodes: string[] = [
    '#FF6347', '#40E0D0', '#7B68EE', '#3CB371', '#FF1493', '#00FA9A', '#4169E1', '#DB7093',
    '#228B22', '#4682B4', '#8A2BE2', '#2E8B57', '#FF4500', '#20B2AA', '#9932CC', '#32CD32',
    '#FFD700', '#00BFFF', '#A0522D', '#00CED1', '#8B4513', '#FFA07A', '#2F4F4F', '#BA55D3',
    '#7FFF00', '#00FFFF', '#FF69B4', '#ADFF2F', '#FF8C00', '#7CFC00', '#00FF7F', '#FFDAB9',
    '#6A5ACD', '#FA8072', '#FFC0CB', '#DDA0DD', '#E9967A', '#8B008B', '#98FB98', '#BDB76B',
    '#FFB6C1', '#FFA500', '#FF00FF', '#B0C4DE', '#C71585', '#DC143C', '#8A2BE2', '#5F9EA0',
    '#FF6347', '#6495ED', '#3CB371', '#FF1493', '#00FA9A', '#9370DB', '#8B0000', '#008080',
    '#48D1CC', '#D2691E', '#0000CD', '#191970', '#006400', '#556B2F', '#8B4513', '#FF4500',
    '#FF69B4', '#CD5C5C', '#008B8B', '#B8860B', '#B22222', '#7B68EE', '#4682B4', '#9932CC',
    '#008000', '#DA70D6', '#FFA500', '#DC143C', '#00CED1', '#4169E1', '#2E8B57', '#00008B',
    '#8B008B', '#DDA0DD', '#FF00FF', '#A0522D', '#6B8E23', '#20B2AA', '#BA55D3', '#00BFFF',
    '#CD853F', '#EE82EE', '#FF1493', '#32CD32', '#4682B4', '#C71585', '#00FA9A', '#FF7F50',
    '#7FFF00', '#DC143C', '#8A2BE2', '#FF6347', '#ADFF2F', '#FF4500', '#BA55D3', '#FF69B4'
  ];

  getColor() {
    const randomIndex: number = Math.floor(Math.random() * this.colorCodes.length)
    return this.colorCodes[randomIndex];
  }
}
