import { Directive, OnInit, HostBinding, HostListener,ElementRef } from '@angular/core';

@Directive({
    selector: 'date-listener'
})
export class TimeCardDirective implements OnInit {
    constructor(private elementRef: ElementRef) {}

    ngOnInit() {}
@HostBinding('elementRef.nativeElement').value() value:string = ''


}