import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosParqueaderoComponent } from './datos-parqueadero.component';

describe('DatosParqueaderoComponent', () => {
  let component: DatosParqueaderoComponent;
  let fixture: ComponentFixture<DatosParqueaderoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatosParqueaderoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosParqueaderoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
