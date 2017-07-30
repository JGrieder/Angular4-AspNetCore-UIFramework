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
/**
 * TODO Add Support for Input Group Button
 *
 * TODO Support Icon Classes
 * This may need to be a component
 */
var TextFieldAddonDirective = (function () {
    function TextFieldAddonDirective() {
    }
    return TextFieldAddonDirective;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], TextFieldAddonDirective.prototype, "position", void 0);
TextFieldAddonDirective = __decorate([
    core_1.Directive({
        selector: "text-field-addon",
        host: {}
    })
], TextFieldAddonDirective);
exports.TextFieldAddonDirective = TextFieldAddonDirective;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL3RleHQtZmllbGQtYWRkb24uZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWlEO0FBRWpEOzs7OztHQUtHO0FBTUgsSUFBYSx1QkFBdUI7SUFBcEM7SUFLQSxDQUFDO0lBQUQsOEJBQUM7QUFBRCxDQUxBLEFBS0MsSUFBQTtBQUZHO0lBREMsWUFBSyxFQUFFOzt5REFDMEI7QUFIekIsdUJBQXVCO0lBSm5DLGdCQUFTLENBQUM7UUFDUCxRQUFRLEVBQUUsa0JBQWtCO1FBQzVCLElBQUksRUFBRSxFQUFHO0tBQ1osQ0FBQztHQUNXLHVCQUF1QixDQUtuQztBQUxZLDBEQUF1QiIsImZpbGUiOiJ1eC9mb3Jtcy90ZXh0LWZpZWxkLWFkZG9uLmRpcmVjdGl2ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERpcmVjdGl2ZSwgSW5wdXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5cclxuLyoqXHJcbiAqIFRPRE8gQWRkIFN1cHBvcnQgZm9yIElucHV0IEdyb3VwIEJ1dHRvblxyXG4gKiBcclxuICogVE9ETyBTdXBwb3J0IEljb24gQ2xhc3Nlc1xyXG4gKiBUaGlzIG1heSBuZWVkIHRvIGJlIGEgY29tcG9uZW50IFxyXG4gKi9cclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gICAgc2VsZWN0b3I6IFwidGV4dC1maWVsZC1hZGRvblwiLFxyXG4gICAgaG9zdDogeyB9XHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBUZXh0RmllbGRBZGRvbkRpcmVjdGl2ZSB7XHJcblxyXG4gICAgQElucHV0KClcclxuICAgIHB1YmxpYyBwb3NpdGlvbjogXCJsZWZ0XCIgfCBcInJpZ2h0XCI7XHJcblxyXG59Il0sInNvdXJjZVJvb3QiOiIuL0NvbnRlbnQvYXBwbGljYXRpb24ifQ==
