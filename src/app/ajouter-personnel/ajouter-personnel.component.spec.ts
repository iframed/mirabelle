import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterPersonnelComponent } from './ajouter-personnel.component';

describe('AjouterPersonnelComponent', () => {
  let component: AjouterPersonnelComponent;
  let fixture: ComponentFixture<AjouterPersonnelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AjouterPersonnelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjouterPersonnelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
