import { HttpClient } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../platform/services/auth.service';
import { DatabaseService } from '../platform/services/database.service';

import { Error404Component } from './error404.component';

describe('Error404Component', () => {
  let component: Error404Component;
  let fixture: ComponentFixture<Error404Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Error404Component ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Error404Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should to be zero', () => {
    expect(component.getCero).toBeTruthy()
  });
/* 
  it('Probar conexion a internet', async(() => {
    const service: AuthService = TestBed.get(AuthService);
    service.checkInternet().subscribe(
      (response) => expect(response.json()).not.toBeNull(),
      (error) => fail(error)
    );
  })); */

});
