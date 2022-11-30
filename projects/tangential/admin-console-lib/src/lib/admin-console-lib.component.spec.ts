import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConsoleLibComponent } from './admin-console-lib.component';

describe('AdminConsoleLibComponent', () => {
  let component: AdminConsoleLibComponent;
  let fixture: ComponentFixture<AdminConsoleLibComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminConsoleLibComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminConsoleLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
