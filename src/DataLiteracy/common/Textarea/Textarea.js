import "./Textarea.scss";

function Textarea({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      className="textareaWrapper"
    ></textarea>
  );
}

export default Textarea;
