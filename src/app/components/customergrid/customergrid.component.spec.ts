import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomergridComponent } from './customergrid.component';

describe('CustomergridComponent', () => {
  let component: CustomergridComponent;
  let fixture: ComponentFixture<CustomergridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CustomergridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomergridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
