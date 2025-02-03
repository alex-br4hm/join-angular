import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalAndHelpComponent } from './legal-and-help.component';

describe('LegalAndHelpComponent', () => {
  let component: LegalAndHelpComponent;
  let fixture: ComponentFixture<LegalAndHelpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalAndHelpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LegalAndHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
