import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-popup-contact-form',
  imports: [
    MatIcon
  ],
  templateUrl: './popup-contact-form.component.html',
  styleUrl: './popup-contact-form.component.scss'
})
export class PopupContactFormComponent implements OnInit{
  @Input() type!: string;
  @Output() popUp = new EventEmitter<boolean>();

  ngOnInit() {
    this.type = 'Add'
  }

  closePopUp() {
    this.popUp.emit(false);
  }
}
