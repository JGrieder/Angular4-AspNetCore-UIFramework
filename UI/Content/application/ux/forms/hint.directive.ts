import { Directive, Input } from "@angular/core";

@Directive({
    selector: "hint",
    host: {
        "[class.text-muted]": "true",
        "[class.float-right]": "align == 'end'",
        "[attr.id]": "id"
    }
})
export class HintDirective {

    @Input()
    public align: "start" | "end" = "start";

    @Input()
    public id: string = `input-hint-${this.newGuid()}`;

    //TODO Move this into a utils class
    public newGuid() {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
            character => {
                const random = Math.random() * 16 | 0;
                const value = character === "x" ? random : (random & 0x3 | 0x8);
                return value.toString();
            });
    }
}