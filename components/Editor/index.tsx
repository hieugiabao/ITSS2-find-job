import JoditEditor from "jodit-react";
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const Editor: React.FC<Props> = ({ value, onChange }) => {
  const editor = React.useRef(null);

  return (
    <JoditEditor
      ref={editor}
      value={value}
      onChange={(content) => {
        onChange(content);
      }}
      className="prose prose-lg"
    />
  );
};

export default Editor;
