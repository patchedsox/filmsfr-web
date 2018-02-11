import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormBuilder } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { MatAutocomplete } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FilmLocationSchema, SearchLocations } from 'goldengate24k';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { OnDestroy } from '@angular/core';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit, OnDestroy {
  private pageSize = 10;

  searchInput: FormControl;
  skip: BehaviorSubject<number>;

  public searchResults = new BehaviorSubject<Array<FilmLocationSchema>>([]);
  public selectedResult = new Observable<FilmLocationSchema>();
  public debounceTime = 0;

  private sub: Subscription;

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
    this.sub = Observable
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
      .subscribe();

    this.selectedResult = this.autoComplete.optionSelected.map(c => c.option.value as FilmLocationSchema);
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
    this.sub.unsubscribe();
  }
}
