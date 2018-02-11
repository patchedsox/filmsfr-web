import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { FilmLocationSchema } from 'goldengate24k';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  styleUrls: ['./info-card.component.scss']
})
export class InfoCardComponent implements OnInit {
  @Input() item: FilmLocationSchema;

  constructor() { }

  ngOnInit() {
  }

}
