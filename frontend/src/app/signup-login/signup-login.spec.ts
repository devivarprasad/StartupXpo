import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupLogin } from './signup-login';

describe('SignupLogin', () => {
  let component: SignupLogin;
  let fixture: ComponentFixture<SignupLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
