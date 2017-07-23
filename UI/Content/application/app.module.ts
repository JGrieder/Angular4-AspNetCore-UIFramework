import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { MaverickFormsModule } from "./ux/forms/maverick-forms.module";
import { DemoComponent } from "./demo/demo.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";


@NgModule({
    declarations: [
        AppComponent,
        DemoComponent
    ],
    imports: [
        BrowserModule,
        MaverickFormsModule,
        CommonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }