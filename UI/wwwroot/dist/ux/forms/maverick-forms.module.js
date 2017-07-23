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
var form_control_feedback_directive_1 = require("./form-control-feedback.directive");
exports.FormControlFeedbackDirective = form_control_feedback_directive_1.FormControlFeedbackDirective;
var input_directive_1 = require("./input.directive");
exports.InputDirective = input_directive_1.InputDirective;
var form_control_container_component_1 = require("./form-control-container.component");
exports.FormControlContainerComponent = form_control_container_component_1.FormControlContainerComponent;
var input_group_addon_directive_1 = require("./input-group-addon.directive");
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
            form_control_feedback_directive_1.FormControlFeedbackDirective,
            input_directive_1.InputDirective,
            form_control_container_component_1.FormControlContainerComponent,
            input_group_addon_directive_1.InputGroupAddonDirective,
            autosize_directive_1.TextAreaAutoSizeDirective
        ],
        imports: [
            forms_1.FormsModule,
            common_1.CommonModule
        ],
        exports: [
            hint_directive_1.HintDirective,
            form_control_feedback_directive_1.FormControlFeedbackDirective,
            input_directive_1.InputDirective,
            form_control_container_component_1.FormControlContainerComponent,
            input_group_addon_directive_1.InputGroupAddonDirective,
            autosize_directive_1.TextAreaAutoSizeDirective
        ]
    })
], MaverickFormsModule);
exports.MaverickFormsModule = MaverickFormsModule;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV4L2Zvcm1zL21hdmVyaWNrLWZvcm1zLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBLHNDQUF5QztBQUN6Qyx3Q0FBNkM7QUFDN0MsMENBQStDO0FBRS9DLG1EQUFpRDtBQU94Qix3QkFQaEIsOEJBQWEsQ0FPZ0I7QUFOdEMscUZBQWlGO0FBTXpDLHVDQU4vQiw4REFBNEIsQ0FNK0I7QUFMcEUscURBQW1EO0FBSzFDLHlCQUxBLGdDQUFjLENBS0E7QUFKdkIsdUZBQW1GO0FBSWIsd0NBSjdELGdFQUE2QixDQUk2RDtBQUhuRyw2RUFBeUU7QUFDekUsMkRBQWdFO0FBRXFDLG9DQUY1Riw4Q0FBeUIsQ0FFNEY7QUF3QjlILElBQWEsbUJBQW1CO0lBQWhDO0lBQW1DLENBQUM7SUFBRCwwQkFBQztBQUFELENBQW5DLEFBQW9DLElBQUE7QUFBdkIsbUJBQW1CO0lBdEIvQixlQUFRLENBQUM7UUFDTixZQUFZLEVBQUU7WUFDViw4QkFBYTtZQUNiLDhEQUE0QjtZQUM1QixnQ0FBYztZQUNkLGdFQUE2QjtZQUM3QixzREFBd0I7WUFDeEIsOENBQXlCO1NBQzVCO1FBQ0QsT0FBTyxFQUFFO1lBQ0wsbUJBQVc7WUFDWCxxQkFBWTtTQUNmO1FBQ0QsT0FBTyxFQUFFO1lBQ0wsOEJBQWE7WUFDYiw4REFBNEI7WUFDNUIsZ0NBQWM7WUFDZCxnRUFBNkI7WUFDN0Isc0RBQXdCO1lBQ3hCLDhDQUF5QjtTQUM1QjtLQUNKLENBQUM7R0FDVyxtQkFBbUIsQ0FBSTtBQUF2QixrREFBbUIiLCJmaWxlIjoidXgvZm9ybXMvbWF2ZXJpY2stZm9ybXMubW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gXCJAYW5ndWxhci9mb3Jtc1wiO1xyXG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XHJcblxyXG5pbXBvcnQgeyBIaW50RGlyZWN0aXZlIH0gZnJvbSBcIi4vaGludC5kaXJlY3RpdmVcIjtcclxuaW1wb3J0IHsgRm9ybUNvbnRyb2xGZWVkYmFja0RpcmVjdGl2ZSB9IGZyb20gXCIuL2Zvcm0tY29udHJvbC1mZWVkYmFjay5kaXJlY3RpdmVcIjtcclxuaW1wb3J0IHsgSW5wdXREaXJlY3RpdmUgfSBmcm9tIFwiLi9pbnB1dC5kaXJlY3RpdmVcIjtcclxuaW1wb3J0IHsgRm9ybUNvbnRyb2xDb250YWluZXJDb21wb25lbnQgfSBmcm9tIFwiLi9mb3JtLWNvbnRyb2wtY29udGFpbmVyLmNvbXBvbmVudFwiO1xyXG5pbXBvcnQgeyBJbnB1dEdyb3VwQWRkb25EaXJlY3RpdmUgfSBmcm9tIFwiLi9pbnB1dC1ncm91cC1hZGRvbi5kaXJlY3RpdmVcIjtcclxuaW1wb3J0IHsgVGV4dEFyZWFBdXRvU2l6ZURpcmVjdGl2ZSB9IGZyb20gXCIuL2F1dG9zaXplLmRpcmVjdGl2ZVwiXHJcblxyXG5leHBvcnQgeyBJbnB1dERpcmVjdGl2ZSwgSGludERpcmVjdGl2ZSwgRm9ybUNvbnRyb2xGZWVkYmFja0RpcmVjdGl2ZSwgRm9ybUNvbnRyb2xDb250YWluZXJDb21wb25lbnQsIFRleHRBcmVhQXV0b1NpemVEaXJlY3RpdmUgfVxyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGRlY2xhcmF0aW9uczogW1xyXG4gICAgICAgIEhpbnREaXJlY3RpdmUsXHJcbiAgICAgICAgRm9ybUNvbnRyb2xGZWVkYmFja0RpcmVjdGl2ZSxcclxuICAgICAgICBJbnB1dERpcmVjdGl2ZSxcclxuICAgICAgICBGb3JtQ29udHJvbENvbnRhaW5lckNvbXBvbmVudCxcclxuICAgICAgICBJbnB1dEdyb3VwQWRkb25EaXJlY3RpdmUsXHJcbiAgICAgICAgVGV4dEFyZWFBdXRvU2l6ZURpcmVjdGl2ZVxyXG4gICAgXSxcclxuICAgIGltcG9ydHM6IFtcclxuICAgICAgICBGb3Jtc01vZHVsZSxcclxuICAgICAgICBDb21tb25Nb2R1bGVcclxuICAgIF0sXHJcbiAgICBleHBvcnRzOiBbXHJcbiAgICAgICAgSGludERpcmVjdGl2ZSxcclxuICAgICAgICBGb3JtQ29udHJvbEZlZWRiYWNrRGlyZWN0aXZlLFxyXG4gICAgICAgIElucHV0RGlyZWN0aXZlLFxyXG4gICAgICAgIEZvcm1Db250cm9sQ29udGFpbmVyQ29tcG9uZW50LFxyXG4gICAgICAgIElucHV0R3JvdXBBZGRvbkRpcmVjdGl2ZSxcclxuICAgICAgICBUZXh0QXJlYUF1dG9TaXplRGlyZWN0aXZlXHJcbiAgICBdXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBNYXZlcmlja0Zvcm1zTW9kdWxlIHsgfSJdLCJzb3VyY2VSb290IjoiLi9Db250ZW50L2FwcGxpY2F0aW9uIn0=
