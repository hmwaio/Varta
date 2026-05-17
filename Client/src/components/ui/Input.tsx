import type { LabeledInputType } from "../../types/type";

export const LabeledInput = ({
  label,
  placeholder,
  type,
  value,
  onchange,
  maxlength,
}: LabeledInputType) => {
  return (
    <>
      <div>
        <label className="mb-2 block text-sm md:text-xl font-medium text-gray-700">
          {label}
        </label>
        <input
          type={type || "text"}
          value={value}
          placeholder={placeholder}
          required
          onChange={onchange}
          maxLength={maxlength || 50}
          className="w-xs md:w-lg h-14 border-2 pl-2 rounded-2xl border-gray-400 bg-gray-50 text-gray-800 font-semibold text-lg hover:border-gray-500 focus:outline-none focus:border-orange-600"
        />
      </div>
    </>
  );
};
