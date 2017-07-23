import { Directive, ElementRef, OnInit, AfterViewInit, HostListener, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/platform-browser"
import { ParentOverflow } from "./parent-overflow.model";

@Directive({
    selector: "[autosize]",
    host: {
        "[class.hide-overflow-x]": "true",
        "[class.word-wrap-break]": "true"
    }
})
export class TextAreaAutoSizeDirective implements OnInit, AfterViewInit {

    private _heightOffset: number;
    private _clientWidth: number;
    private _cachedHeight: number;
    
    constructor(
        private _elementRef: ElementRef,
        @Inject(DOCUMENT) private _document: Document) {

        this._heightOffset = 0;
        this._clientWidth = _elementRef.nativeElement.clientWidth;
        this._cachedHeight = 0;
    }

    @HostListener("input")
    public updateOnInput(keyEvent): void {
        this._update();
    }

    @HostListener("window:resize")
    public pageResize(): void {
        if (this._elementRef.nativeElement.clientWidth !== this._clientWidth) {
            this._update();
        }
    }

    public ngOnInit(): void { this._validateNativeElement(); }

    public ngAfterViewInit(): void {
        const style = window.getComputedStyle(this._elementRef.nativeElement, null);

        if (style.resize === "vertical") {
            this._elementRef.nativeElement.resize = "none";
        }
        else if (style.resize === "both") {
            this._elementRef.nativeElement.resize = "horizontal";
        }

        if (style.boxSizing === "content-box") {
            this._heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
        } else {
            this._heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        }

        //Fix when a textarea is not on document body and heightOffset is Not a Number
        if (isNaN(this._heightOffset)) {
            this._heightOffset = 0;
        }

        this._update();
    }

    private _update(): void {
        this._resize();

        const styleHeight = Math.round(parseFloat(this._elementRef.nativeElement.style.height));
        const computed = window.getComputedStyle(this._elementRef.nativeElement, null);

        // Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
        let actualHeight = computed.boxSizing === "content-box"
            ? Math.round(parseFloat(computed.height))
            : this._elementRef.nativeElement.offsetHeight;

        // The actual height not matching the style height (set via the resize method) indicates that
        // the max-height has been exceeded, in which case the overflow should be allowed.
        if (actualHeight !== styleHeight) {
            if (computed.overflowY === "hidden") {
                this._changeOverflow("scroll");
                this._resize();
                actualHeight = computed.boxSizing === "content-box"
                    ? Math.round(parseFloat(window.getComputedStyle(this._elementRef.nativeElement, null).height))
                    : this._elementRef.nativeElement.offsetHeight;
            }
        } else {
            //Normally keep overflow set to hidden to avoid the flash of a scroll bar as the textarea expand
            if (computed.overflowY !== "hidden") {
                this._changeOverflow("hidden");
                this._resize();
                actualHeight = computed.boxSizing === "content-box"
                    ? Math.round(parseFloat(window.getComputedStyle(this._elementRef.nativeElement, null).height))
                    : this._elementRef.nativeElement.offsetHeight;
            }
        }

        if (this._cachedHeight !== actualHeight) {
            this._cachedHeight = actualHeight;
            this._elementRef.nativeElement.dispatchEvent(new Event("autosize:resized"));
        }
    }

    private _resize(): void {
        const originalHeight = this._elementRef.nativeElement.height;
        const overflows = this._getParentOverflows(this._elementRef.nativeElement);
        const documentTop = this._document.documentElement && this._document.documentElement.scrollTop;

        this._elementRef.nativeElement.style.height = "";

        const endHeight = this._elementRef.nativeElement.scrollHeight + this._heightOffset;

        if (this._elementRef.nativeElement.scrollHeight === 0) {
            // If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
            this._elementRef.nativeElement.style.height = originalHeight;
            return;
        }

        this._elementRef.nativeElement.style.height = endHeight + "px";

        //Used to check to see if an update is neccessary on window.resize
        this._clientWidth = this._elementRef.nativeElement.clientWidth;

        overflows.forEach((element: any) => {
            element.node.scrollTop = element.scrollTop;
        });

        if (documentTop) {
            this._document.documentElement.scrollTop = documentTop;
        }
    }

    private _changeOverflow(value: string): void {

        // Chrome/Safari-specific fix:
        // When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
        // made available by removing the scrollbar. The following forces the necessary text reflow.
        const width = this._elementRef.nativeElement.style.width;
        this._elementRef.nativeElement.style.width = 0;

        //Force Reflow
        // ReSharper disable once WrongExpressionStatement
        this._elementRef.nativeElement.offsetWidth;

        this._elementRef.nativeElement.style.width = width;

        this._elementRef.nativeElement.overflowY = value;
    }

    private _getParentOverflows(element: HTMLElement): Array<ParentOverflow> {
        const parentOverflows = new Array<ParentOverflow>();

        while (element && element.parentElement && element.parentElement instanceof Element) {
            if (element.parentElement.scrollTop) {
                parentOverflows.push({
                    element: element.parentElement,
                    scrollTop: element.parentElement.scrollTop
                });
            }
            element = element.parentElement;
        }

        return parentOverflows;
    }

    private _validateNativeElement() {
        if (this._elementRef.nativeElement.nodeName.toLowerCase() !== "textarea") {
            throw new Error("The autosize directive is only supported on textarea elements.");
        }
    }

}