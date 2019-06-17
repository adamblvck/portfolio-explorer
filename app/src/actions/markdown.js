export const SHOW_FULLSCREEN_MD = 'show_fullscreen_md';
export const HIDE_FULLSCREEN_MD = 'hide_fullscreen_md';

export function showFullscreenMarkdown(markdown) {

    console.log("show fullscreen triggered");

    return {
        type: SHOW_FULLSCREEN_MD,
        payload: markdown
    }
}

export function hideFullscreenMarkdown(){

    console.log("hide fullscreen triggered");

    return {
        type: HIDE_FULLSCREEN_MD,
        payload: {}
    }
}
