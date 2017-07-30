import { Directive, Input } from "@angular/core";

/**
 * TODO Add Support for Input Group Button
 * 
 * TODO Support Icon Classes
 * This may need to be a component so it has access to a template
 */

@Directive({
    selector: "text-field-addon",
    host: { }
})
export class TextFieldAddonDirective {

    @Input()
    public position: "left" | "right";

}