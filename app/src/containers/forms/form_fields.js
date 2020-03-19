import React from 'react';
import { TextField, Select, MenuItem, FormControl, FormHelperText} from '@material-ui/core';
import { gradients, getTextColor } from './gradient_helper.js';

const renderField = (field) => {
	const { meta : { touched, error } } = field;
	const className = `form-group ${touched && error ? 'has-danger' : ''}`;

	return (
		<div className={className}>
			<TextField
				id={field.name}
				label={field.label}
				className="form-control"
				margin="normal"
				disabled={field.disabled}
				{...field.input}
			/>
		</div>
	);
}

const renderTextField = (field) => {
    const { meta : { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    return (
        <div className={className}>
            <TextField
                id={field.name}
                label={field.label}
                className="form-control"
                margin="normal"
                multiline
                rows="4"
                {...field.input}
            />
        </div>
    );
}

const renderGradientField = (field) => {
    const { meta : { touched, error } } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`;

    console.log(gradients);
	
    const background_color = field.input.value;
    const matching_textColor = getTextColor(background_color);

    return (
        <div className={className}>
            <FormControl variant="outlined" className="gradient-select-form">
                <Select
                    // label={field.label}
                    id={field.name}
                    style={{backgroundColor: background_color, background: background_color, color: matching_textColor}}
                    {...field.input}
                >
                    {_.map(gradients, gradient => {
                        const gradient_background = gradient.value;
                        const { name, textColor } = gradient;
                        return (
                            <MenuItem
                                value={gradient_background}
                                style={{backgroundColor: `${gradient_background}`, background: `${gradient_background}`, color: `${textColor}`}}
                            >
                                {name}
                            </MenuItem>);
                    })}
                </Select>
                <FormHelperText>{field.label}</FormHelperText>
            </FormControl>
			
        </div>
    );
}

export {
	renderField,
	renderTextField,
	renderGradientField
};