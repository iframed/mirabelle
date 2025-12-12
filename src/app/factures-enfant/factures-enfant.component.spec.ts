import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturesEnfantComponent } from './factures-enfant.component';

describe('FacturesEnfantComponent', () => {
  let component: FacturesEnfantComponent;
  let fixture: ComponentFixture<FacturesEnfantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturesEnfantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturesEnfantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
