import { Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, PLATFORM_ID, Inject, NgZone } from '@angular/core';
import { isPlatformServer } from '@angular/common';

declare let require: any;
const lottie: any = require('lottie-web/build/player/lottie.js');

@Component({
    selector: 'lottie-animation-view',
    template: `<div #lavContainer 
                    [ngStyle]="{'width': viewWidth, 'height': viewHeight, 'overflow':'hidden', 'margin': '0 auto'}">    
               </div>`
})

export class LottieAnimationViewComponent implements OnInit {
    
    constructor(@Inject(PLATFORM_ID) private platformId: string, private zone: NgZone) {}

    @Input() options: any;
    @Input() width: number;
    @Input() height: number;

    @Output() animCreated: any = new EventEmitter();

    @ViewChild('lavContainer') lavContainer: ElementRef;

    public viewWidth: string;
    public viewHeight: string;
    private _options: any;
    private _anim: any;

    ngOnInit() {
        
        if(isPlatformServer(this.platformId)){return;}
        
        this._options = {
            container: this.lavContainer.nativeElement,
            renderer: 'svg',
            loop: this.options.loop !== false,
            autoplay: this.options.autoplay !== false,
            autoloadSegments: this.options.autoloadSegments !== false,
            animationData: this.options.animationData,
            path: this.options.path || '',
            rendererSettings: this.options.rendererSettings || {}
        };

        this.viewWidth = this.width + 'px' || '100%';
        this.viewHeight = this.height + 'px' || '100%';

        this.zone.runOutsideAngular(() => {
            this._anim = lottie.loadAnimation(this._options);
        })

        this._anim.addEventListener('data_ready',() => {
            this.zone.run(() => {
                this.animCreated.emit(this._anim);
            });
        });
    }
}
