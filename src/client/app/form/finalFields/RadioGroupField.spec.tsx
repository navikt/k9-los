import React from 'react';
import { expect } from 'chai';
import { Form } from 'react-final-form';

import { mountWithIntl } from 'testHelpers/intl-enzyme-test-helper';
import RadioGroupField from './RadioGroupField';
import RadioOption from './RadioOption';

const mountFieldInForm = (field) => mountWithIntl(
  <Form
    onSubmit={() => undefined}
    render={() => (
      <>
        {field}
      </>
    )}
  />,
);

describe('<RadioGroupField>', () => {
  it('Skal rendre radio inputs', () => {
    const wrapper = mountFieldInForm(
      <RadioGroupField label="label" columns={4} name="name">
        <RadioOption label="label" value />
        <RadioOption label="label" value={false} />
      </RadioGroupField>,
    );
    expect(wrapper.find('input')).to.have.length(2);
    expect(wrapper.find('input[type="radio"]')).to.have.length(2);
  });

  it('Skal rendre med fullbredde', () => {
    const wrapper = mountFieldInForm(
      <RadioGroupField label="label" bredde="fullbredde" name="name">
        <RadioOption label="label" value />
        <RadioOption label="label" value={false} />
      </RadioGroupField>,
    );
    expect(wrapper.find('[className="skjemagruppe input--fullbredde radioGroup"]')).to.have.length(1);
  });
});
