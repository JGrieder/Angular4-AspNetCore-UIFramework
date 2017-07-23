import { NgModule } from "@angular/core";

import { MaverickFormsModule } from "./forms/maverick-forms.module";

@NgModule({
    imports: [   
        MaverickFormsModule
    ],
    exports: [
        MaverickFormsModule
    ]
})
export class MaverickModule { }