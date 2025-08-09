import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadIdea } from './upload-idea';

describe('UploadIdea', () => {
  let component: UploadIdea;
  let fixture: ComponentFixture<UploadIdea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadIdea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadIdea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
