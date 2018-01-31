import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';

import { FaceDetectorProvider  } from '../providers/face-detector.provider';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    { provide: 'FaceDetector', useValue: new window['FaceDetector']({ fastMode: true, maxDetectedFaces: 2 }) }
    // FaceDetectorProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
