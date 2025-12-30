/**
 * Reusable form input components
 * Select, Number Input, Checkbox, and Slider
 */

import React from 'react';
import type { SelectOption } from '@/types';
import styles from './FormInput.module.css';

// Select Input
interface SelectInputProps {
  label: string;
  value: string | number | boolean | null;
  options: SelectOption<any>[];
  onChange: (value: any) => void;
  placeholder?: string;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  options,
  onChange,
  placeholder = 'Please select',
}) => {
  return (
    <div className={styles.inputItem}>
      <label>{label}</label>
      <select
        value={value === null ? '' : String(value)}
        onChange={(e) => {
          const selectedOption = options.find((opt) => String(opt.value) === e.target.value);
          onChange(selectedOption?.value ?? null);
        }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {options.map((option, index) => (
          <option key={index} value={String(option.value)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Number Input
interface NumberInputProps {
  label: string;
  value: number | undefined;
  onChange: (value: number) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  step,
}) => {
  return (
    <div className={styles.inputItem}>
      <label>{label}</label>
      <input
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
};

// Checkbox Input
interface CheckboxInputProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxInput: React.FC<CheckboxInputProps> = ({ label, checked, onChange }) => {
  return (
    <label className={styles.checkboxLabel}>
      {label}
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
    </label>
  );
};

// Slider Input
interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
}) => {
  return (
    <div className={styles.inputItem}>
      <label>{label}</label>
      <div className={styles.sliderWrapper}>
        <div className={styles.sliderLabel}>{value.toFixed(2)}</div>
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={styles.slider}
        />
      </div>
      <div className={styles.sliderRange}>
        <span>{min.toFixed(2)}</span>
        <span>{max.toFixed(2)}</span>
      </div>
    </div>
  );
};
