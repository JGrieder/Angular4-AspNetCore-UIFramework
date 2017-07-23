"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var TextAreaAutoSizeDirective = (function () {
    function TextAreaAutoSizeDirective(_elementRef, _document) {
        this._elementRef = _elementRef;
        this._document = _document;
        this._heightOffset = 0;
        this._clientWidth = _elementRef.nativeElement.clientWidth;
        this._cachedHeight = 0;
    }
    TextAreaAutoSizeDirective.prototype.updateOnInput = function (keyEvent) {
        this._update();
    };
    TextAreaAutoSizeDirective.prototype.pageResize = function () {
        if (this._elementRef.nativeElement.clientWidth !== this._clientWidth) {
            this._update();
        }
    };
    TextAreaAutoSizeDirective.prototype.ngOnInit = function () { this._validateNativeElement(); };
    TextAreaAutoSizeDirective.prototype.ngAfterViewInit = function () {
        var style = window.getComputedStyle(this._elementRef.nativeElement, null);
        if (style.resize === "vertical") {
            this._elementRef.nativeElement.resize = "none";
        }
        else if (style.resize === "both") {
            this._elementRef.nativeElement.resize = "horizontal";
        }
        if (style.boxSizing === "content-box") {
            this._heightOffset = -(parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
        }
        else {
            this._heightOffset = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
        }
        //Fix when a textarea is not on document body and heightOffset is Not a Number
        if (isNaN(this._heightOffset)) {
            this._heightOffset = 0;
        }
        this._update();
    };
    TextAreaAutoSizeDirective.prototype._update = function () {
        this._resize();
        var styleHeight = Math.round(parseFloat(this._elementRef.nativeElement.style.height));
        var computed = window.getComputedStyle(this._elementRef.nativeElement, null);
        // Using offsetHeight as a replacement for computed.height in IE, because IE does not account use of border-box
        var actualHeight = computed.boxSizing === "content-box"
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
        }
        else {
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
    };
    TextAreaAutoSizeDirective.prototype._resize = function () {
        var originalHeight = this._elementRef.nativeElement.height;
        var overflows = this._getParentOverflows(this._elementRef.nativeElement);
        var documentTop = this._document.documentElement && this._document.documentElement.scrollTop;
        this._elementRef.nativeElement.style.height = "";
        var endHeight = this._elementRef.nativeElement.scrollHeight + this._heightOffset;
        if (this._elementRef.nativeElement.scrollHeight === 0) {
            // If the scrollHeight is 0, then the element probably has display:none or is detached from the DOM.
            this._elementRef.nativeElement.style.height = originalHeight;
            return;
        }
        this._elementRef.nativeElement.style.height = endHeight + "px";
        //Used to check to see if an update is neccessary on window.resize
        this._clientWidth = this._elementRef.nativeElement.clientWidth;
        overflows.forEach(function (element) {
            element.node.scrollTop = element.scrollTop;
        });
        if (documentTop) {
            this._document.documentElement.scrollTop = documentTop;
        }
    };
    TextAreaAutoSizeDirective.prototype._changeOverflow = function (value) {
        // Chrome/Safari-specific fix:
        // When the textarea y-overflow is hidden, Chrome/Safari do not reflow the text to account for the space
        // made available by removing the scrollbar. The following forces the necessary text reflow.
        var width = this._elementRef.nativeElement.style.width;
        this._elementRef.nativeElement.style.width = 0;
        //Force Reflow
        // ReSharper disable once WrongExpressionStatement
        this._elementRef.nativeElement.offsetWidth;
        this._elementRef.nativeElement.style.width = width;
        this._elementRef.nativeElement.overflowY = value;
    };
    TextAreaAutoSizeDirective.prototype._getParentOverflows = function (element) {
        var parentOverflows = new Array();
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
    };
    TextAreaAutoSizeDirective.prototype._validateNativeElement = function () {
        if (this._elementRef.nativeElement.nodeName.toLowerCase() !== "textarea") {
            throw new Error("The autosize directive is only supported on textarea elements.");
        }
    };
    return TextAreaAutoSizeDirective;
}());
__decorate([
    core_1.HostListener("input"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TextAreaAutoSizeDirective.prototype, "updateOnInput", null);
__decorate([
    core_1.HostListener("window:resize"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TextAreaAutoSizeDirective.prototype, "pageResize", null);
TextAreaAutoSizeDirective = __decorate([
    core_1.Directive({
        selector: "[autosize]",
        host: {
            "[class.hide-overflow-x]": "true",
            "[class.word-wrap-break]": "true"
        }
    }),
    __param(1, core_1.Inject(platform_browser_1.DOCUMENT)),
    __metadata("design:paramtypes", [core_1.ElementRef,
        Document])
], TextAreaAutoSizeDirective);
exports.TextAreaAutoSizeDirective = TextAreaAutoSizeDirective;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL2F1dG9zaXplLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUFtRztBQUNuRyw4REFBb0Q7QUFVcEQsSUFBYSx5QkFBeUI7SUFNbEMsbUNBQ1ksV0FBdUIsRUFDTCxTQUFtQjtRQURyQyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtRQUNMLGNBQVMsR0FBVCxTQUFTLENBQVU7UUFFN0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQztRQUMxRCxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztJQUMzQixDQUFDO0lBR00saURBQWEsR0FBcEIsVUFBcUIsUUFBUTtRQUN6QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUdNLDhDQUFVLEdBQWpCO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsV0FBVyxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQixDQUFDO0lBQ0wsQ0FBQztJQUVNLDRDQUFRLEdBQWYsY0FBMEIsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRW5ELG1EQUFlLEdBQXRCO1FBQ0ksSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRTVFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ25ELENBQUM7UUFDRCxJQUFJLENBQUMsRUFBRSxD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QUMsQ0FBQyxDQUFDO2dCQUNsQyxlQUFlLENBQUMsSUFBSSxDQUFDO29CQUNqQixPQUFPLEVBQUUsT0FBTyxDQUFDLGFBQWE7b0JBQzlCLFNBQVMsRUFBRSxPQUFPLENBQUMsYUFBYSxDQUFDLFNBQVM7aUJBQzdDLENBQUMsQ0FBQztZQUNQLENBQUM7WUFDRCxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUNwQyxDQUFDO1FBRUQsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUMzQixDQUFDO0lBRU8sMERBQXNCLEdBQTlCO1FBQ0ksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLFdBQVcsRUFBRSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDdkUsTUFBTSxJQUFJLEtBQUssQ0FBQyxnRUFBZ0UsQ0FBQyxDQUFDO1FBQ3RGLENBQUM7SUFDTCxDQUFDO0lBRUwsZ0NBQUM7QUFBRCxDQS9KQSxBQStKQyxJQUFBO0FBL0lHO0lBREMsbUJBQVksQ0FBQyxPQUFPLENBQUM7Ozs7OERBR3JCO0FBR0Q7SUFEQyxtQkFBWSxDQUFDLGVBQWUsQ0FBQzs7OzsyREFLN0I7QUF6QlEseUJBQXlCO0lBUHJDLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsWUFBWTtRQUN0QixJQUFJLEVBQUU7WUFDRix5QkFBeUIsRUFBRSxNQUFNO1lBQ2pDLHlCQUF5QixFQUFFLE1BQU07U0FDcEM7S0FDSixDQUFDO0lBU08sV0FBQSxhQUFNLENBQUMsMkJBQVEsQ0FBQyxDQUFBO3FDQURJLGlCQUFVO1FBQ00sUUFBUTtHQVJ4Qyx5QkFBeUIsQ0ErSnJDO0FBL0pZLDhEQUF5QiIsImZpbGUiOiJ1eC9mb3Jtcy9hdXRvc2l6ZS5kaXJlY3RpdmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgSG9zdExpc3RlbmVyLCBJbmplY3QgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gXCJAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyXCJcclxuaW1wb3J0IHsgUGFyZW50T3ZlcmZsb3cgfSBmcm9tIFwiLi9wYXJlbnQtb3ZlcmZsb3cubW9kZWxcIjtcclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6IFwiW2F1dG9zaXplXVwiLFxyXG4gICAgaG9zdDoge1xyXG4gICAgICAgIFwiW2NsYXNzLmhpZGUtb3ZlcmZsb3cteF1cIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgXCJbY2xhc3Mud29yZC13cmFwLWJyZWFrXVwiOiBcInRydWVcIlxyXG4gICAgfVxyXG59KVxyXG5leHBvcnQgY2xhc3MgVGV4dEFyZWFBdXRvU2l6ZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCB7XHJcblxyXG4gICAgcHJpdmF0ZSBfaGVpZ2h0T2Zmc2V0OiBudW1iZXI7XHJcbiAgICBwcml2YXRlIF9jbGllbnRXaWR0aDogbnVtYmVyO1xyXG4gICAgcHJpdmF0ZSBfY2FjaGVkSGVpZ2h0OiBudW1iZXI7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHByaXZhdGUgX2VsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXHJcbiAgICAgICAgQEluamVjdChET0NVTUVOVCkgcHJpdmF0ZSBfZG9jdW1lbnQ6IERvY3VtZW50KSB7XHJcblxyXG4gICAgICAgIHRoaXMuX2hlaWdodE9mZnNldCA9IDA7XHJcbiAgICAgICAgdGhpcy5fY2xpZW50V2lkdGggPSBfZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoO1xyXG4gICAgICAgIHRoaXMuX2NhY2hlZEhlaWdodCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgQEhvc3RMaXN0ZW5lcihcImlucHV0XCIpXHJcbiAgICBwdWJsaWMgdXBkYXRlT25JbnB1dChrZXlFdmVudCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIEBIb3N0TGlzdGVuZXIoXCJ3aW5kb3c6cmVzaXplXCIpXHJcbiAgICBwdWJsaWMgcGFnZVJlc2l6ZSgpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoICE9PSB0aGlzLl9jbGllbnRXaWR0aCkge1xyXG4gICAgICAgICAgICB0aGlzLl91cGRhdGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIG5nT25Jbml0KCk6IHZvaWQgeyB0aGlzLl92YWxpZGF0ZU5hdGl2ZUVsZW1lbnQoKTsgfVxyXG5cclxuICAgIHB1YmxpYyBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsIG51bGwpO1xyXG5cclxuICAgICAgICBpZiAoc3R5bGUucmVzaXplID09PSBcInZlcnRpY2FsXCIpIHtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnJlc2l6ZSA9IFwibm9uZVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChzdHlsZS5yZXNpemUgPT09IFwiYm90aFwiKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5yZXNpemUgPSBcImhvcml6b250YWxcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChzdHlsZS5ib3hTaXppbmcgPT09IFwiY29udGVudC1ib3hcIikge1xyXG4gICAgICAgICAgICB0aGlzLl9oZWlnaHRPZmZzZXQgPSAtKHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1RvcCkgKyBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdCb3R0b20pKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLl9oZWlnaHRPZmZzZXQgPSBwYXJzZUZsb2F0KHN0eWxlLmJvcmRlclRvcFdpZHRoKSArIHBhcnNlRmxvYXQoc3R5bGUuYm9yZGVyQm90dG9tV2lkdGgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9GaXggd2hlbiBhIHRleHRhcmVhIGlzIG5vdCBvbiBkb2N1bWVudCBib2R5IGFuZCBoZWlnaHRPZmZzZXQgaXMgTm90IGEgTnVtYmVyXHJcbiAgICAgICAgaWYgKGlzTmFOKHRoaXMuX2hlaWdodE9mZnNldCkpIHtcclxuICAgICAgICAgICAgdGhpcy5faGVpZ2h0T2Zmc2V0ID0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuX3VwZGF0ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3VwZGF0ZSgpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLl9yZXNpemUoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc3R5bGVIZWlnaHQgPSBNYXRoLnJvdW5kKHBhcnNlRmxvYXQodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCkpO1xyXG4gICAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBudWxsKTtcclxuXHJcbiAgICAgICAgLy8gVXNpbmcgb2Zmc2V0SGVpZ2h0IGFzIGEgcmVwbGFjZW1lbnQgZm9yIGNvbXB1dGVkLmhlaWdodCBpbiBJRSwgYmVjYXVzZSBJRSBkb2VzIG5vdCBhY2NvdW50IHVzZSBvZiBib3JkZXItYm94XHJcbiAgICAgICAgbGV0IGFjdHVhbEhlaWdodCA9IGNvbXB1dGVkLmJveFNpemluZyA9PT0gXCJjb250ZW50LWJveFwiXHJcbiAgICAgICAgICAgID8gTWF0aC5yb3VuZChwYXJzZUZsb2F0KGNvbXB1dGVkLmhlaWdodCkpXHJcbiAgICAgICAgICAgIDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuXHJcbiAgICAgICAgLy8gVGhlIGFjdHVhbCBoZWlnaHQgbm90IG1hdGNoaW5nIHRoZSBzdHlsZSBoZWlnaHQgKHNldCB2aWEgdGhlIHJlc2l6ZSBtZXRob2QpIGluZGljYXRlcyB0aGF0XHJcbiAgICAgICAgLy8gdGhlIG1heC1oZWlnaHQgaGFzIGJlZW4gZXhjZWVkZWQsIGluIHdoaWNoIGNhc2UgdGhlIG92ZXJmbG93IHNob3VsZCBiZSBhbGxvd2VkLlxyXG4gICAgICAgIGlmIChhY3R1YWxIZWlnaHQgIT09IHN0eWxlSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIGlmIChjb21wdXRlZC5vdmVyZmxvd1kgPT09IFwiaGlkZGVuXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX2NoYW5nZU92ZXJmbG93KFwic2Nyb2xsXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzaXplKCk7XHJcbiAgICAgICAgICAgICAgICBhY3R1YWxIZWlnaHQgPSBjb21wdXRlZC5ib3hTaXppbmcgPT09IFwiY29udGVudC1ib3hcIlxyXG4gICAgICAgICAgICAgICAgICAgID8gTWF0aC5yb3VuZChwYXJzZUZsb2F0KHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgbnVsbCkuaGVpZ2h0KSlcclxuICAgICAgICAgICAgICAgICAgICA6IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvL05vcm1hbGx5IGtlZXAgb3ZlcmZsb3cgc2V0IHRvIGhpZGRlbiB0byBhdm9pZCB0aGUgZmxhc2ggb2YgYSBzY3JvbGwgYmFyIGFzIHRoZSB0ZXh0YXJlYSBleHBhbmRcclxuICAgICAgICAgICAgaWYgKGNvbXB1dGVkLm92ZXJmbG93WSAhPT0gXCJoaWRkZW5cIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5fY2hhbmdlT3ZlcmZsb3coXCJoaWRkZW5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNpemUoKTtcclxuICAgICAgICAgICAgICAgIGFjdHVhbEhlaWdodCA9IGNvbXB1dGVkLmJveFNpemluZyA9PT0gXCJjb250ZW50LWJveFwiXHJcbiAgICAgICAgICAgICAgICAgICAgPyBNYXRoLnJvdW5kKHBhcnNlRmxvYXQod2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCBudWxsKS5oZWlnaHQpKVxyXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuX2NhY2hlZEhlaWdodCAhPT0gYWN0dWFsSGVpZ2h0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuX2NhY2hlZEhlaWdodCA9IGFjdHVhbEhlaWdodDtcclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEV2ZW50KFwiYXV0b3NpemU6cmVzaXplZFwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX3Jlc2l6ZSgpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCBvcmlnaW5hbEhlaWdodCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5oZWlnaHQ7XHJcbiAgICAgICAgY29uc3Qgb3ZlcmZsb3dzID0gdGhpcy5fZ2V0UGFyZW50T3ZlcmZsb3dzKHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudCk7XHJcbiAgICAgICAgY29uc3QgZG9jdW1lbnRUb3AgPSB0aGlzLl9kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQgJiYgdGhpcy5fZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcclxuXHJcbiAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IFwiXCI7XHJcblxyXG4gICAgICAgIGNvbnN0IGVuZEhlaWdodCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zY3JvbGxIZWlnaHQgKyB0aGlzLl9oZWlnaHRPZmZzZXQ7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsSGVpZ2h0ID09PSAwKSB7XHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBzY3JvbGxIZWlnaHQgaXMgMCwgdGhlbiB0aGUgZWxlbWVudCBwcm9iYWJseSBoYXMgZGlzcGxheTpub25lIG9yIGlzIGRldGFjaGVkIGZyb20gdGhlIERPTS5cclxuICAgICAgICAgICAgdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLmhlaWdodCA9IG9yaWdpbmFsSGVpZ2h0O1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gZW5kSGVpZ2h0ICsgXCJweFwiO1xyXG5cclxuICAgICAgICAvL1VzZWQgdG8gY2hlY2sgdG8gc2VlIGlmIGFuIHVwZGF0ZSBpcyBuZWNjZXNzYXJ5IG9uIHdpbmRvdy5yZXNpemVcclxuICAgICAgICB0aGlzLl9jbGllbnRXaWR0aCA9IHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGllbnRXaWR0aDtcclxuXHJcbiAgICAgICAgb3ZlcmZsb3dzLmZvckVhY2goKGVsZW1lbnQ6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBlbGVtZW50Lm5vZGUuc2Nyb2xsVG9wID0gZWxlbWVudC5zY3JvbGxUb3A7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChkb2N1bWVudFRvcCkge1xyXG4gICAgICAgICAgICB0aGlzLl9kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wID0gZG9jdW1lbnRUb3A7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgX2NoYW5nZU92ZXJmbG93KHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcclxuXHJcbiAgICAgICAgLy8gQ2hyb21lL1NhZmFyaS1zcGVjaWZpYyBmaXg6XHJcbiAgICAgICAgLy8gV2hlbiB0aGUgdGV4dGFyZWEgeS1vdmVyZmxvdyBpcyBoaWRkZW4sIENocm9tZS9TYWZhcmkgZG8gbm90IHJlZmxvdyB0aGUgdGV4dCB0byBhY2NvdW50IGZvciB0aGUgc3BhY2VcclxuICAgICAgICAvLyBtYWRlIGF2YWlsYWJsZSBieSByZW1vdmluZyB0aGUgc2Nyb2xsYmFyLiBUaGUgZm9sbG93aW5nIGZvcmNlcyB0aGUgbmVjZXNzYXJ5IHRleHQgcmVmbG93LlxyXG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5fZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLndpZHRoO1xyXG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IDA7XHJcblxyXG4gICAgICAgIC8vRm9yY2UgUmVmbG93XHJcbiAgICAgICAgLy8gUmVTaGFycGVyIGRpc2FibGUgb25jZSBXcm9uZ0V4cHJlc3Npb25TdGF0ZW1lbnRcclxuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgICAgIHRoaXMuX2VsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IHdpZHRoO1xyXG5cclxuICAgICAgICB0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub3ZlcmZsb3dZID0gdmFsdWU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfZ2V0UGFyZW50T3ZlcmZsb3dzKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogQXJyYXk8UGFyZW50T3ZlcmZsb3c+IHtcclxuICAgICAgICBjb25zdCBwYXJlbnRPdmVyZmxvd3MgPSBuZXcgQXJyYXk8UGFyZW50T3ZlcmZsb3c+KCk7XHJcblxyXG4gICAgICAgIHdoaWxlIChlbGVtZW50ICYmIGVsZW1lbnQucGFyZW50RWxlbWVudCAmJiBlbGVtZW50LnBhcmVudEVsZW1lbnQgaW5zdGFuY2VvZiBFbGVtZW50KSB7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnBhcmVudEVsZW1lbnQuc2Nyb2xsVG9wKSB7XHJcbiAgICAgICAgICAgICAgICBwYXJlbnRPdmVyZmxvd3MucHVzaCh7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogZWxlbWVudC5wYXJlbnRFbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogZWxlbWVudC5wYXJlbnRFbGVtZW50LnNjcm9sbFRvcFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50RWxlbWVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBwYXJlbnRPdmVyZmxvd3M7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBfdmFsaWRhdGVOYXRpdmVFbGVtZW50KCkge1xyXG4gICAgICAgIGlmICh0aGlzLl9lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gXCJ0ZXh0YXJlYVwiKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBhdXRvc2l6ZSBkaXJlY3RpdmUgaXMgb25seSBzdXBwb3J0ZWQgb24gdGV4dGFyZWEgZWxlbWVudHMuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iXSwic291cmNlUm9vdCI6Ii4vQ29udGVudC9hcHBsaWNhdGlvbiJ9
