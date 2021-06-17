import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DwibComponent } from './dwib.component';

describe('DwibComponent', () => {
  let component: DwibComponent;
  let fixture: ComponentFixture<DwibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DwibComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DwibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
