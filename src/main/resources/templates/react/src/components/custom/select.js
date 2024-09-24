import React from 'react';

const Select = (props) => {
  const { values, callback, selected, disabled, readonly } = props;

  return (
    <select
      disabled={disabled}
      readOnly={readonly}
      value={selected} // selected 대신 value 사용
      onChange={({ target: { value } }) => callback(value)}
      className='form-select form-select-sm'
    >
      {values &&
        values.length > 0 &&
        values.map(({ value, text }) => (
          <option value={value} key={value}>
            {text}
          </option>
        ))}
    </select>
  );
};

export default Select;
