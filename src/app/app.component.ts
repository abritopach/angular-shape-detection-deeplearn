import { Component, AfterViewInit, ViewChild, ElementRef, NgZone, HostListener, Inject } from '@angular/core';

import { FaceDetector, IFaceDetector } from '../providers/face-detector.provider';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  // https://medium.com/the-unitgb/building-a-real-time-smile-detection-app-with-deeplearn-js-820eb48e09b7
  // https://paul.kinlan.me/face-detection/

  // ViewChild allow us to get a reference to the canvas and video elements.
  @ViewChild( 'video' ) videoRef: ElementRef;
  @ViewChild( 'canvas' ) canvasRef: ElementRef;

  private video: HTMLVideoElement;
  private videoWidth: number;
  private videoHeight: number;

  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // private faceDetector: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {

    /*
    this.videoWidth = event.target.innerWidth;
    this.videoHeight = event.target.innerHeight;
    this.ctx.canvas.width  = this.videoWidth;
    this.ctx.canvas.height = this.videoHeight;
    console.log('this.videoWidth', this.videoWidth);
    console.log('this.videoHeight', this.videoHeight);
    */

    const rw = this.ctx.canvas.width; // Real canvas width.
    const rh = this.ctx.canvas.height; // Real canvas height.

    const wh = event.target.innerHeight;
    const ww = event.target.innerWidth;

    const rwh = rw / rh;
    const rhw = rh / rw;

    let cw = 0; // New canvas width.
    let ch = 0; // New canvas height.

    if (wh * rwh < ww) {
      // Fit in height black on left and right.
      ch = wh;
      cw = wh * rwh;
    } else {
      // Fit in width, black on top and bottom.
     ch = ww * rhw;
      cw = ww;
  }

    this.ctx.canvas.style.width = cw + 'px';
    this.ctx.canvas.style.height = ch + 'px';
  }

  constructor( private zone: NgZone, @Inject('FaceDetector') private faceDetector: any
  /*@Inject('FaceDetector') private faceDetector: IFaceDetector*/) {}

  ngAfterViewInit() {
    // Get references to the video and canvas elements.
    this.video = this.videoRef.nativeElement;
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext( '2d' );
    // Create a new face detector.
    // this.faceDetector = new window[ 'FaceDetector' ]( { fastMode: true, maxDetectedFaces: 2 } );
    // Start the webcam.
    this.startVideo();
  }

  startVideo() {
    // Request access to the webcam. This should show the popup allowing the user to accept or
    // decline access to the webcam.
    navigator.getUserMedia( {
      video: true,
      audio: false
    }, mediaStream => {
      // Successfully started a media stream, bind it to our video element.
      this.video.src = window.URL.createObjectURL( mediaStream );
      // Once the video is loaded set our canvas element to match it's width and height.
      this.video.addEventListener( 'loadeddata', () => {
        this.videoWidth = this.video.videoWidth;
        this.videoHeight = this.video.videoHeight;
        this.canvas.height = this.videoHeight;
        this.canvas.width = this.videoWidth;
      } );
      this.zone.runOutsideAngular( () => this.update() );
    }, error => {
      console.log( error );
    } );
  }

  async update() {
    // Detect faces in the video feed.
    // The face detector detect function returns a Promise with the detected faces so we can use
    // async/await to make our code a bit cleaner.
    const faces = await this.faceDetector.detect(this.canvas);
    // Draw the latest frame from the video to canvas.
    // console.log('this.videoWidth', this.videoWidth);
    // console.log('this.videoHeight', this.videoHeight);
    this.ctx.drawImage( this.video, 0, 0, this.videoWidth, this.videoHeight );
    // Mark the detected faces on the canvas.
    this.markFaces( faces );
    // Request the next frame.
    requestAnimationFrame( () => this.update() );
  }

  markFaces(faces: any[]) {
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'red';
    faces.forEach( face => {
      this.ctx.beginPath();
      this.ctx.rect(
        face.boundingBox.x,
        face.boundingBox.y,
        face.boundingBox.width,
        face.boundingBox.height
      );
      this.ctx.closePath();
      this.ctx.stroke();
    });
  }
}
