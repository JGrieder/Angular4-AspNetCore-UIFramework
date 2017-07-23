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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var HintDirective = (function () {
    function HintDirective() {
        this.align = "start";
        this.id = "input-hint-" + this.newGuid();
    }
    //TODO Move this into a utils class
    HintDirective.prototype.newGuid = function () {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (character) {
            var random = Math.random() * 16 | 0;
            var value = character === "x" ? random : (random & 0x3 | 0x8);
            return value.toString();
        });
    };
    return HintDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], HintDirective.prototype, "align", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], HintDirective.prototype, "id", void 0);
HintDirective = __decorate([
    core_1.Directive({
        selector: "hint",
        host: {
            "[class.text-muted]": "true",
            "[class.float-right]": "align == 'end'",
            "[attr.id]": "id"
        }
    })
], HintDirective);
exports.HintDirective = HintDirective;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL2hpbnQuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWlEO0FBVWpELElBQWEsYUFBYTtJQVIxQjtRQVdXLFVBQUssR0FBb0IsT0FBTyxDQUFDO1FBR2pDLE9BQUUsR0FBVyxnQkFBYyxJQUFJLENBQUMsT0FBTyxFQUFJLENBQUM7SUFXdkQsQ0FBQztJQVRHLG1DQUFtQztJQUM1QiwrQkFBTyxHQUFkO1FBQ0ksTUFBTSxDQUFDLHNDQUFzQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQ3pELFVBQUEsU0FBUztZQUNMLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ3RDLElBQU0sS0FBSyxHQUFHLFNBQVMsS0FBSyxHQUFHLEdBQUcsTUFBTSxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNoRSxNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUNMLG9CQUFDO0FBQUQsQ0FqQkEsQUFpQkMsSUFBQTtBQWRHO0lBREMsWUFBSyxFQUFFOzs0Q0FDZ0M7QUFHeEM7SUFEQyxZQUFLLEVBQUU7O3lDQUMyQztBQU4xQyxhQUFhO0lBUnpCLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsTUFBTTtRQUNoQixJQUFJLEVBQUU7WUFDRixvQkFBb0IsRUFBRSxNQUFNO1lBQzVCLHFCQUFxQixFQUFFLGdCQUFnQjtZQUN2QyxXQUFXLEVBQUUsSUFBSTtTQUNwQjtLQUNKLENBQUM7R0FDVyxhQUFhLENBaUJ6QjtBQWpCWSxzQ0FBYSIsImZpbGUiOiJ1eC9mb3Jtcy9oaW50LmRpcmVjdGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5cclxuQERpcmVjdGl2ZSh7XHJcbiAgICBzZWxlY3RvcjogXCJoaW50XCIsXHJcbiAgICBob3N0OiB7XHJcbiAgICAgICAgXCJbY2xhc3MudGV4dC1tdXRlZF1cIjogXCJ0cnVlXCIsXHJcbiAgICAgICAgXCJbY2xhc3MuZmxvYXQtcmlnaHRdXCI6IFwiYWxpZ24gPT0gJ2VuZCdcIixcclxuICAgICAgICBcIlthdHRyLmlkXVwiOiBcImlkXCJcclxuICAgIH1cclxufSlcclxuZXhwb3J0IGNsYXNzIEhpbnREaXJlY3RpdmUge1xyXG5cclxuICAgIEBJbnB1dCgpXHJcbiAgICBwdWJsaWMgYWxpZ246IFwic3RhcnRcIiB8IFwiZW5kXCIgPSBcInN0YXJ0XCI7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBpZDogc3RyaW5nID0gYGlucHV0LWhpbnQtJHt0aGlzLm5ld0d1aWQoKX1gO1xyXG5cclxuICAgIC8vVE9ETyBNb3ZlIHRoaXMgaW50byBhIHV0aWxzIGNsYXNzXHJcbiAgICBwdWJsaWMgbmV3R3VpZCgpIHtcclxuICAgICAgICByZXR1cm4gXCJ4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHhcIi5yZXBsYWNlKC9beHldL2csXHJcbiAgICAgICAgICAgIGNoYXJhY3RlciA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByYW5kb20gPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBjaGFyYWN0ZXIgPT09IFwieFwiID8gcmFuZG9tIDogKHJhbmRvbSAmIDB4MyB8IDB4OCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6Ii4vQ29udGVudC9hcHBsaWNhdGlvbiJ9
