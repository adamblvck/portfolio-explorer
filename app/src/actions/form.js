export const OPEN_GROUP_FORM = "open_group_form";
export const CLOSE_GROUP_FORM = "close_group_form";

export const OPEN_CONCEPT_FORM = "open_concept_form";
export const CLOSE_CONCEPT_FORM = "close_concept_form";

export const OPEN_BOARD_FORM = "open_board_form";
export const CLOSE_BOARD_FORM = "close_board_form";

// Local development has a different url than when deployed on heroku
const isLOCALHOST = (location.hostname === "localhost" || location.hostname === "127.0.0.1");
const ROOT_URL = isLOCALHOST ? 'http://localhost:4000/graphql' : '/graphql';

export function openGroupForm(params) {
    const payload = {
        mode: params.mode,
        open: true,
        form_type: "group",
        initialValues: params.initialValues
    };

    return {
        type: OPEN_GROUP_FORM,
        payload: payload
    }
}

export function closeGroupForm() {
    return {
        type: CLOSE_GROUP_FORM,
        payload: {}
    }
}

export function openConceptForm(params) {
    const payload = {
        mode: params.mode,
        open: true,
        form_type: "concept",
        initialValues: params.initialValues
    };

    return {
        type: OPEN_CONCEPT_FORM,
        payload: payload
    }
}

export function closeConceptForm() {
    return {
        type: CLOSE_CONCEPT_FORM,
        payload: {}
    }
}

export function openBoardForm(params) {
    const payload = {
        mode: params.mode,
        open: true,
        form_type: "board",
        initialValues: params.initialValues
    };

    return {
        type: OPEN_BOARD_FORM,
        payload: payload
    }
}

export function closeBoardForm() {
    return {
        type: CLOSE_BOARD_FORM,
        payload: {}
    }
}