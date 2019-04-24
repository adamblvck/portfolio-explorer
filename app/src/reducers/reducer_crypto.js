import { FETCH_CRYPTO_PRICES} from '../actions/fetching_public';

export default function(state = null, action) {
    switch(action.type) {
        case FETCH_CRYPTO_PRICES:
            return { data: action.payload.data.Data} ;
        default:
            return state;
    }
}