import autosize from "autosize";

export default function resizeTextareas() {
    autosize(document.querySelectorAll("textarea"));
    autosize.update(document.querySelectorAll("textarea"));
}
