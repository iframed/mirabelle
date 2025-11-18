import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrComponent } from './cr.component';

describe('CrComponent', () => {
  let component: CrComponent;
  let fixture: ComponentFixture<CrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
