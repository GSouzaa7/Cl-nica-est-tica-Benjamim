import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface WordEditorProps {
    value: string;
    onChange: (value: string) => void;
}

const quillModules = {
    toolbar: {
        container: '#custom-toolbar'
    }
};

export const WordEditor: React.FC<WordEditorProps> = ({ value, onChange }) => {
    return (
        <div className="flex-1 w-full border-none bg-transparent">
            <ReactQuill
                theme="snow"
                value={value || ""}
                onChange={onChange}
                modules={quillModules}
            />
        </div>
    );
};
