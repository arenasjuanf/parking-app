import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../platform/services/auth.service';
import { LoginComponent } from './login.component';


describe('AppComponent', () => {

  let component: LoginComponent;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LoginComponent
      ],imports:[
        ReactiveFormsModule
      ], providers:[
        AuthService
      ]
    }).compileComponents();
  }));

  it(`valid form`, () => {
    let auth: AuthService
    let comp: LoginComponent = new LoginComponent(auth);

    comp.form = formBuilder.group({
      email: ['test@test.com', Validators.email]
    });

    expect(comp.form.valid).toBeTruthy();

   /*  expect(app.title).toEqual('Parking-App'); */
  });


});
