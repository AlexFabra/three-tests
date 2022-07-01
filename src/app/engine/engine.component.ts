import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {EngineService} from './engine.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true})
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  @HostListener('window:mousemove',['$event'])
  onMousemove(event: MouseEvent){
    this.engServ.onDocumentMouseMove(event)
  }

  @HostListener("wheel", ["$event"])
  public onScroll(event: WheelEvent) {
    this.engServ.onDocumentWheelMove(event.deltaY);
  }

  public constructor(private engServ: EngineService) {
  }

  public ngOnInit(): void {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
  }

}
