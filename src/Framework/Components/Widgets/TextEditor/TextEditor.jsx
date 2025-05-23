import React from "react";
import { Editor } from "@tinymce/tinymce-react";
import { PropTypes } from "prop-types";
import LicenseKeys from "Configration/Utilities/LicenseManager/LicenseKeys.json";
import "./TextEditor.scss";

function TextEditor({ value, onChange, setWordcount, sizeLimit }) {
  const charCount = (editor) => editor.getContent({ format: "text" }).length;

  const handleInit = (value, editor) => {
    setWordcount(charCount(editor));
  };

  const handleUpdate = (value, editor) => {
    const cCount = charCount(editor);
    if (cCount <= sizeLimit) {
      onChange(value);
      if (cCount) {
        setWordcount(cCount);
      }
    }
  };

  const handleBeforeAddUndo = (evt, editor) => {
    if (charCount(editor) > sizeLimit) {
      evt.preventDefault();
    }
  };

  return (
    <Editor
      onInit={handleInit}
      apiKey={LicenseKeys.TinyTextEditor}
      value={value}
      onEditorChange={handleUpdate}
      onBeforeAddUndo={handleBeforeAddUndo}
      init={{
        height: 240,
        menubar: false,
        plugins: "wordcount",
        toolbar:
          "undo redo | blocks | underline strikethrough " +
          "bold italic | alignleft aligncenter" +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat",
        content_style:
          "body { font-family:font-weight: 500; font-size: 14px; margin: 10px; color: #11344d; } p { margin: 2px 0;font-weight: 500; }  * { margin: 2px 0; }",
      }}
    />
  );
}

export default TextEditor;

TextEditor.propTypes = {
  value: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  setWordcount: PropTypes.func.isRequired,
  sizeLimit: PropTypes.number.isRequired,
};
