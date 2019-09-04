import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellersSelectComponent } from './sellers-select.component';

describe('SellersSelectComponent', () => {
  let component: SellersSelectComponent;
  let fixture: ComponentFixture<SellersSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellersSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellersSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
