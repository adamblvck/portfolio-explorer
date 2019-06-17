import { SHOW_FULLSCREEN_MD, HIDE_FULLSCREEN_MD } from '../actions/markdown';

export default function(state = null, action) {
    switch(action.type){
        case SHOW_FULLSCREEN_MD:
            const fullscreen_md = { 
                md_html: action.payload, 
                open: true
            };

            console.log("fullscreen", fullscreen_md);

            return fullscreen_md;
            
        case HIDE_FULLSCREEN_MD:

            console.log("Getting it out!");

            // keep previous position
            const close_fullscreen_md = {
                ...state,
                open: false
            }
            
            return close_fullscreen_md;

        default:
            return state;
    }
}