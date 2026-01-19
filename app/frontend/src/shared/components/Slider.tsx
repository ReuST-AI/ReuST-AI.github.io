import { type InputHTMLAttributes, forwardRef, useState, useEffect } from 'react';
import clsx from 'clsx';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  min: number;
  max: number;
  step: number;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      label,
      min,
      max,
      step,
      showValue = true,
      valueFormatter = (val) => val.toFixed(2),
      value,
      onChange,
      className,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState(value ?? min);

    useEffect(() => {
      if (value !== undefined) {
        setLocalValue(value);
      }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setLocalValue(newValue);
      onChange?.(e);
    };

    const percentage = ((Number(localValue) - min) / (max - min)) * 100;

    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-medium" htmlFor={props.id}>
            {label}
          </label>
        )}
        <div className="relative mt-2.5">
          {showValue && (
            <div
              className="absolute -top-6 text-sm font-medium"
              style={{ left: `calc(${percentage}% - 1rem)` }}
            >
              {valueFormatter(Number(localValue))}
            </div>
          )}
          <input
            ref={ref}
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue}
            onChange={handleChange}
            className={clsx('w-full cursor-pointer', className)}
            {...props}
          />
          <div className="mt-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>{min.toFixed(2)}</span>
            <span>{max.toFixed(2)}</span>
          </div>
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';
