import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { HintDirective } from "./hint.directive";
import { InputDirective } from "./input.directive";
import { FormControlContainerComponent } from "./form-control-container.component";
import { InputGroupAddonDirective } from "./input-group-addon.directive";
import { TextAreaAutoSizeDirective } from "./autosize.directive"

export { InputDirective, HintDirective, FormControlContainerComponent, TextAreaAutoSizeDirective }

@NgModule({
    declarations: [
        HintDirective,
        InputDirective,
        FormControlContainerComponent,
        InputGroupAddonDirective,
        TextAreaAutoSizeDirective
    ],
    imports: [
        FormsModule,
        CommonModule
    ],
    exports: [
        HintDirective,
        InputDirective,
        FormControlContainerComponent,
        InputGroupAddonDirective,
        TextAreaAutoSizeDirective
    ]
})
export class MaverickFormsModule { }