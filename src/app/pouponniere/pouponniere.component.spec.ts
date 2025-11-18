import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PouponniereComponent } from './pouponniere.component';

describe('PouponniereComponent', () => {
  let component: PouponniereComponent;
  let fixture: ComponentFixture<PouponniereComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PouponniereComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PouponniereComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
