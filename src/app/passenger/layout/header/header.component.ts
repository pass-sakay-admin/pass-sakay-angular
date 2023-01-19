import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passenger-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  
  constructor(
    private route: Router
  ) {}
  
  public linkActive: boolean = false;

  ngOnInit(): void {}
}
