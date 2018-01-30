import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';

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

  private faceDetector: any;

  constructor( private zone: NgZone ) {}

  ngAfterViewInit() {
    // Get references to the video and canvas elements.
    this.video = this.videoRef.nativeElement;
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext( '2d' );
    // Create a new face detector.
    this.faceDetector = new window[ 'FaceDetector' ]( { fastMode: true, maxDetectedFaces: 2 } );
    console.log(this.faceDetector);
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
