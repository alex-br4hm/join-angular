import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupContactFormComponent } from './popup-contact-form.component';

describe('PopupContactFormComponent', () => {
  let component: PopupContactFormComponent;
  let fixture: ComponentFixture<PopupContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupContactFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
