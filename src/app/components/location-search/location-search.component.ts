import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FilmLocationSchema, SearchLocations } from 'goldengate24k';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OnDestroy } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit, OnDestroy {
  private pageSize = 10;

  searchInput: FormControl;
  skip: BehaviorSubject<number>;

  subs: Subscription[] = [];
  public searchResults = new BehaviorSubject<Array<FilmLocationSchema>>([]);
  public selectedResult = new Subject<FilmLocationSchema>();
  public debounceTime = 0;


  @ViewChild(MatAutocomplete) autoComplete: MatAutocomplete;

  constructor(private builder: FormBuilder) {
    this.searchInput = this.builder.control('');
    this.skip = new BehaviorSubject(0);
  }

  displayFn(location?: FilmLocationSchema): string {
    if (!location) {
      return;
    }
    return 'Movie title: ' + location.title;
  }

  ngOnInit() {
    this.subs.push(
      Observable
        .combineLatest(
          this.searchInput.valueChanges
            .map((val) => {
              this.skip.next(0);
              return val;
            })
            .debounceTime(this.debounceTime),
          this.skip,
          (searchText, skip) => {
            return { searchText, skip };
          })
        .mergeMap(({ searchText, skip }) => this.searchLocations(searchText, skip)
          .map(({ value }) => ({ skip, locations: value ? value.locations : [] })))
        .map(m => {
          if (m.skip > 0) {
            this.searchResults.next(this.searchResults.value.concat(m.locations));
          } else {
            this.searchResults.next(m.locations);
          }
        })
        .subscribe()
    );

    this.subs.push(this.autoComplete.optionSelected.subscribe(c => this.selectedResult.next(c.option.value as FilmLocationSchema)));
  }

  loadMore() {
    this.skip.next(this.skip.value + 10);
  }

  searchLocations(searchText: string, skip: number) {
    return Observable.fromPromise(new SearchLocations({
      text: searchText,
      skip: skip,
      take: this.pageSize
    }).send());
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
