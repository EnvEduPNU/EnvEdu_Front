import "./Textarea.scss";

function Textarea({ value, onChange, disabled = false, placeholder = "", d }) {
  return (
    <textarea
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="textareaWrapper"
    ></textarea>
  );
}

export default Textarea;
