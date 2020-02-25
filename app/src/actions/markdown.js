export const SHOW_FULLSCREEN_MD = 'show_fullscreen_md';
export const HIDE_FULLSCREEN_MD = 'hide_fullscreen_md';

export function showFullscreenMarkdown(markdown) {
    return {
        type: SHOW_FULLSCREEN_MD,
        payload: markdown
    }
}

export function hideFullscreenMarkdown(){
    return {
        type: HIDE_FULLSCREEN_MD,
        payload: {}
    }
}
