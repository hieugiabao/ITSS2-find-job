import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const Editor: React.FC<Props> = ({ value, onChange }) => {
  return (
    <CKEditor
      editor={ClassicEditor}
      data={value}
      onChange={(event, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
};

export default Editor;
