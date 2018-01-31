import { InjectionToken, ValueProvider } from '@angular/core';
import { Promise } from 'q';

interface IFaceDetector {
    detect: (canvas: any) => Promise<any>;
}

const FaceDetector: InjectionToken<IFaceDetector> = new InjectionToken<IFaceDetector>('FaceDetector');
const FaceDetectorProvider: ValueProvider = { provide: FaceDetector,
    useValue: new window['FaceDetector']({ fastMode: true, maxDetectedFaces: 2 }) };

export { IFaceDetector, FaceDetector, FaceDetectorProvider };
