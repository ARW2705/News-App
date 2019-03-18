import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  attribution = 'Powered by News API.org';
  attributionURL = 'https://newsapi.org/';
  githubURL = 'https://github.com/ARW2705/';
  github = 'Andrew Wanex ©2019'

  constructor() { }

  ngOnInit() {
  }

}
