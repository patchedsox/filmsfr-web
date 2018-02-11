import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatDrawer) drawer: MatDrawer;

  constructor() { }

  ngOnInit() {
    this.drawer.mode = 'over';
    this.drawer.disableClose = true;
    this.drawer.open();
  }

}
