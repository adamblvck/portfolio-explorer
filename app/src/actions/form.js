export const OPEN_GROUP_FORM = "open_group_form";
export const CLOSE_GROUP_FORM = "close_group_form";

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

export function closeGroupForm(params) {
    return {
        type: CLOSE_GROUP_FORM,
        payload: {}
    }
}