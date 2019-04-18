export const OPEN_GROUP_FORM = "open_group_form";
export const CLOSE_GROUP_FORM = "close_group_form";

export const OPEN_CONCEPT_FORM = "open_concept_form";
export const CLOSE_CONCEPT_FORM = "close_concept_form";

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