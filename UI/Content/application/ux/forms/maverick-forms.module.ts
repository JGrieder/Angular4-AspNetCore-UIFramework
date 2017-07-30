import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { HintDirective } from "./text-field/hint.directive";
import { InputDirective } from "./text-field/input.directive";
import { TextFieldComponent } from "./text-field/text-field.component";
import { TextFieldAddonDirective } from "./text-field/text-field-addon.directive";
import { TextAreaAutoSizeDirective } from "./text-field/autosize.directive"

export { InputDirective, HintDirective, TextFieldComponent, TextAreaAutoSizeDirective }

@NgModule({
    declarations: [
        HintDirective,
        InputDirective,
        TextFieldComponent,
        TextFieldAddonDirective,
        TextAreaAutoSizeDirective
    ],
    imports: [
        FormsModule,
        CommonModule
    ],
    exports: [
        HintDirective,
        InputDirective,
        TextFieldComponent,
        TextFieldAddonDirective,
        TextAreaAutoSizeDirective
    ]
})
export class MaverickFormsModule { }