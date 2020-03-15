import React from 'react'

function NumberField({ defaultValue, min, step, onChange } = { defaultValue: 0 }) {
  const [ state, setState  ] = React.useState(0)

  return (
    <input
      type='number'
      step={step || 1}
      min={min || null}
      value={state || defaultValue || 0}
      onChange={(e) => {
        let value = parseInt(e.target.value || 0)
        if (!isNaN(parseInt(min))) {
          value = Math.max(value, min)
        }

        if (onChange) {
          onChange(value)
        }
        setState(value)
      }
      }
    />
  )
}

export default NumberField
