import * as THREE from 'three';
import { ElementRef, HostListener, Injectable, NgZone, OnDestroy } from '@angular/core';
import { ThisReceiver } from '@angular/compiler';
import { SphereGeometry } from 'three';

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {

  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;

  private cube: THREE.Mesh;
  private rect: THREE.Mesh;
  private circle: THREE.Mesh;

  private sphere = new THREE.SphereGeometry(0.5,100,100);
  private sunMaterial =  new THREE.MeshPhongMaterial({emissive: 0xFFFF00})
  private sunMesh = new THREE.Mesh(this.sphere,this.sunMaterial)

  cameraHorzLimit = 50;
  cameraVertLimit = 50;

  mouse = new THREE.Vector2();
  cameraCenter = new THREE.Vector3();
  wheel = 10;

  private frameId: number = null;
w
  public constructor(private ngZone: NgZone) {
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
    if (this.renderer != null) {
      this.renderer.dispose();
      this.renderer = null;
      this.canvas = null;
    }
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 5;
    this.scene.add(this.camera);

    // soft white light
    this.light = new THREE.AmbientLight(0xafafaf);
    this.light.position.z = 30;
    this.scene.add(this.light);

    this.cube = this.createBox(0x00A7D1, 1, 1, 1);
    this.scene.add(this.cube);
    this.rect = this.createBox(0x97DBEC, 1, 2, 2);
    this.scene.add(this.rect);
    this.circle = this.createCircle(0x11ddaa)
    this.circle.position.y = 5;
    this.scene.add(this.circle)
    let cube = this.createBox(0x111dd1,4,2,100)
    cube.position.y = -5;
    this.scene.add(cube);
    this.sunMesh.scale.set(5,5,5)
    this.scene.add(this.sunMesh)
    let earth=new THREE.Mesh(this.sphere,new THREE.MeshPhongMaterial({color:0x2233FF,emissive:0x112244}));
    this.scene.add(earth)
    this.sunMesh.add(earth)
    this.scene.add(new THREE.PointLight(0xFFFFFF,3))

    
  }

  createBox(color: any, x: number, y: number, z: number) {
    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
  }

  createCircle(color: any) {
    const geometry = new THREE.CircleGeometry(1.5, 40,);
    const material = new THREE.MeshBasicMaterial({ color });
    return new THREE.Mesh(geometry, material);
  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    if(this.cube.position.x<5){
      this.cube.position.x += 0.01;
    }
    else {
      this.cube.position.x -= 0.01;
    }
    
    // this.cube.rotation.x += 0.04;
    // this.cube.rotation.y += 0.01;

    this.rect.rotation.x += 0.01;
    this.rect.rotation.y += 0.04;
    this.renderer.render(this.scene, this.camera);
  }

  public resize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  updateCamera() {
    //offset the camera x/y based on the mouse's position in the window
    this.camera.rotation.x = this.mouse.y//this.cameraCenter.x + (this.cameraHorzLimit * this.mouse.x);
    this.camera.rotation.y = -this.mouse.x //this.cameraCenter.y + (this.cameraVertLimit * this.mouse.y);
    this.camera.position.set(0,0,this.wheel)
    console.log(this.camera.position.x,this.camera.position.y,this.wheel)
  }

  onDocumentMouseMove(event) {
    event.preventDefault();
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this.updateCamera();
}

onDocumentWheelMove(event){
  console.log(event)
  if(event>0){
    this.wheel += 0.2;
  } else {
    this.wheel -= 0.2;
  }
  

}


}
