import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CompareObjectsService {

  compare<T extends object>(obj1: T, obj2: T): boolean {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;
    if (!keys1.every(key => keys2.includes(key))) return false;

    return keys1.every(key => obj1[key as keyof T] === obj2[key as keyof T]);
  }
}
