"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var hint_directive_1 = require("./hint.directive");
exports.HintDirective = hint_directive_1.HintDirective;
var input_directive_1 = require("./input.directive");
exports.InputDirective = input_directive_1.InputDirective;
var text_field_component_1 = require("./text-field.component");
exports.TextFieldComponent = text_field_component_1.TextFieldComponent;
var text_field_addon_directive_1 = require("./text-field-addon.directive");
var autosize_directive_1 = require("./autosize.directive");
exports.TextAreaAutoSizeDirective = autosize_directive_1.TextAreaAutoSizeDirective;
var MaverickFormsModule = (function () {
    function MaverickFormsModule() {
    }
    return MaverickFormsModule;
}());
MaverickFormsModule = __decorate([
    core_1.NgModule({
        declarations: [
            hint_directive_1.HintDirective,
            input_directive_1.InputDirective,
            text_field_component_1.TextFieldComponent,
            text_field_addon_directive_1.TextFieldAddonDirective,
            autosize_directive_1.TextAreaAutoSizeDirective
        ],
        imports: [
            forms_1.FormsModule,
            common_1.CommonModule
        ],
        exports: [
            hint_directive_1.HintDirective,
            input_directive_1.InputDirective,
            text_field_component_1.TextFieldComponent,
            text_field_addon_directive_1.TextFieldAddonDirective,
            autosize_directive_1.TextAreaAutoSizeDirective
        ]
    })
], MaverickFormsModule);
exports.MaverickFormsModule = MaverickFormsModule;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL21hdmVyaWNrLWZvcm1zLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUF5QztBQUN6Qyx3Q0FBNkM7QUFDN0MsMENBQStDO0FBRS9DLG1EQUFpRDtBQU14Qix3QkFOaEIsOEJBQWEsQ0FNZ0I7QUFMdEMscURBQW1EO0FBSzFDLHlCQUxBLGdDQUFjLENBS0E7QUFKdkIsK0RBQTREO0FBSXBCLDZCQUovQix5Q0FBa0IsQ0FJK0I7QUFIMUQsMkVBQXVFO0FBQ3ZFLDJEQUFnRTtBQUVKLG9DQUZuRCw4Q0FBeUIsQ0FFbUQ7QUFzQnJGLElBQWEsbUJBQW1CO0lBQWhDO0lBQW1DLENBQUM7SUFBRCwwQkFBQztBQUFELENBQW5DLEFBQW9DLElBQUE7QUFBdkIsbUJBQW1CO0lBcEIvQixlQUFRLENBQUM7UUFDTixZQUFZLEVBQUU7WUFDViw4QkFBYTtZQUNiLGdDQUFjO1lBQ2QseUNBQWtCO1lBQ2xCLG9EQUF1QjtZQUN2Qiw4Q0FBeUI7U0FDNUI7UUFDRCxPQUFPLEVBQUU7WUFDTCxtQkFBVztZQUNYLHFCQUFZO1NBQ2Y7UUFDRCxPQUFPLEVBQUU7WUFDTCw4QkFBYTtZQUNiLGdDQUFjO1lBQ2QseUNBQWtCO1lBQ2xCLG9EQUF1QjtZQUN2Qiw4Q0FBeUI7U0FDNUI7S0FDSixDQUFDO0dBQ1csbUJBQW1CLENBQUk7QUFBdkIsa0RBQW1CIiwiZmlsZSI6InV4L2Zvcm1zL21hdmVyaWNrLWZvcm1zLm1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcclxuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSBcIkBhbmd1bGFyL2NvbW1vblwiO1xyXG5cclxuaW1wb3J0IHsgSGludERpcmVjdGl2ZSB9IGZyb20gXCIuL2hpbnQuZGlyZWN0aXZlXCI7XHJcbmltcG9ydCB7IElucHV0RGlyZWN0aXZlIH0gZnJvbSBcIi4vaW5wdXQuZGlyZWN0aXZlXCI7XHJcbmltcG9ydCB7IFRleHRGaWVsZENvbXBvbmVudCB9IGZyb20gXCIuL3RleHQtZmllbGQuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFRleHRGaWVsZEFkZG9uRGlyZWN0aXZlIH0gZnJvbSBcIi4vdGV4dC1maWVsZC1hZGRvbi5kaXJlY3RpdmVcIjtcclxuaW1wb3J0IHsgVGV4dEFyZWFBdXRvU2l6ZURpcmVjdGl2ZSB9IGZyb20gXCIuL2F1dG9zaXplLmRpcmVjdGl2ZVwiXHJcblxyXG5leHBvcnQgeyBJbnB1dERpcmVjdGl2ZSwgSGludERpcmVjdGl2ZSwgVGV4dEZpZWxkQ29tcG9uZW50LCBUZXh0QXJlYUF1dG9TaXplRGlyZWN0aXZlIH1cclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgICBkZWNsYXJhdGlvbnM6IFtcclxuICAgICAgICBIaW50RGlyZWN0aXZlLFxyXG4gICAgICAgIElucHV0RGlyZWN0aXZlLFxyXG4gICAgICAgIFRleHRGaWVsZENvbXBvbmVudCxcclxuICAgICAgICBUZXh0RmllbGRBZGRvbkRpcmVjdGl2ZSxcclxuICAgICAgICBUZXh0QXJlYUF1dG9TaXplRGlyZWN0aXZlXHJcbiAgICBdLFxyXG4gICAgaW1wb3J0czogW1xyXG4gICAgICAgIEZvcm1zTW9kdWxlLFxyXG4gICAgICAgIENvbW1vbk1vZHVsZVxyXG4gICAgXSxcclxuICAgIGV4cG9ydHM6IFtcclxuICAgICAgICBIaW50RGlyZWN0aXZlLFxyXG4gICAgICAgIElucHV0RGlyZWN0aXZlLFxyXG4gICAgICAgIFRleHRGaWVsZENvbXBvbmVudCxcclxuICAgICAgICBUZXh0RmllbGRBZGRvbkRpcmVjdGl2ZSxcclxuICAgICAgICBUZXh0QXJlYUF1dG9TaXplRGlyZWN0aXZlXHJcbiAgICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXZlcmlja0Zvcm1zTW9kdWxlIHsgfSJdLCJzb3VyY2VSb290IjoiLi9Db250ZW50L2FwcGxpY2F0aW9uIn0=
