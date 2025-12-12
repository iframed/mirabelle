import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnfantsDocumentsComponent } from './enfants-documents.component';

describe('EnfantsDocumentsComponent', () => {
  let component: EnfantsDocumentsComponent;
  let fixture: ComponentFixture<EnfantsDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnfantsDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnfantsDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
